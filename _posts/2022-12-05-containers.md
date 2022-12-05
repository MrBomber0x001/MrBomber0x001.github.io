---
layout: post
title: Handcrafting containers at low level - without Docker
subtitle: See how containers can be made under the hood, beside some of Docker internals!
cover-img: /assets/img/cover.jfif
thumbnail-img: /assets/img/img2.png
share-img: /assets/img/img2.png
tags: [go]
---
## Table of contents

1. History of containerization

2. Leveraging Linux kernel features by building container

3. Using Docker images without Docker

4. Where to go?

## Prerequisites

* Linux command line familiarity

* Basic knowledge of networking and operating systems

## Introduction

Most people probably give little thought to how containers work under the covers, but I think it’s important to understand the underlying technologies – it helps to inform our decision‑making processes.

This writeup is divided into two main sections, in the first section I will explain the basic idea behind Linux containers using its kernel features like Namespaces, Cgroups, and chroot.

In the second section, I will walk you through a practical example of all that you learned so far by building a container from scratch.

Aren't you excited like me? let's do it

%[https://media.giphy.com/media/BpGWitbFZflfSUYuZ9/giphy.gif]

* * *

## History of containerization

### **What is a container?**

In 4 bullet points:

* Containers share the host kernel

* Containers use the kernel's ability to group processes for resource control

* Containers ensure isolation through namespaces

* Containers feel like lightweight VMs (lower footprint, faster), but are **not Virtual Machines!**

Components of a container **ecosystem** include:

* Runtime

* Image distribution

* Tooling

## Essential Technologies

### **1️⃣ Kernel Namespaces**

Allow you to create isolation of:

* Process trees (PID Namespace)

* Mounts (MNT namespace) `wc -l /proc/mounts`

* Network (Net namespace) `ip addr`

* Users / UIDs (User Namespace)

* Hostnames (UTS Namespace) `hostname`

* Inter-Process Communication (IPC Namespace) `ipcs`

### 2️⃣ Cgroups

Kernel control groups (cgroups) allow you to do accounting on resources used by processes, a little bit of access control on device nodes and other things such as freezing groups of processes.

cgroups consist of one hierarchy (tree) per resource (cpu, memory, …) . for example:

```bash
cpu                      memory
├── batch                ├── 109
│   ├── hadoop           ├── 88 <
│   │   ├── 88 <         ├── 25
│   │   └── 109          ├── 26
└── realtime             └── databases
    ├── nginx                ├── 1008
    │   ├── 25               └── 524
    │   └── 26          
    ├── postgres 
    │   ├── 524  
    └── redis    
        └── 1008
```

* * *

## chroots

With `chroot` you can set up and [run programs or interactive shells](https://man7.org/linux/man-pages/man1/chroot.1.html) such as Bash in an encapsulated filesystem that is prevented from interacting with your regular filesystem. Everything within the `chroot` the environment is penned in and contained. Nothing in the `chroot` the environment can see out past its own, special, root directory without escalating to root privileges. That has earned this type of environment the nickname of a `chroot` jail

In some senses, `chroot` environments are closer to containers such as [LXC](https://linuxcontainers.org/) than to virtual machines. They’re lightweight, quick to deploy, and creating and firing one up can be automated

We need to create directories to hold the portions of the operating system our `chroot` environment will require. We’re going to set up a minimalist Linux environment that uses Bash as the interactive shell.

follow along with me

```sh
docker run -it --name docker-host --rm --privileged ubuntu:bionic
```

Then inside this ubuntu container, we're going to make our `chroot` environment

`ldd` is used to list the command's dependencies

```bash
root@6639a75f6ca3:/# mkdir my-new-root
root@6639a75f6ca3:/# cp bin/bash my-new-root/bin
root@6639a75f6ca3:/# ldd bin/bash
root@6639a75f6ca3:/# mkdir my-new-root/lib{,64}
root@6639a75f6ca3:/# chroot my-new-root bash
```

To see which libs bash depends on

```sh
$ ldd bin/bash

linux-vdso.so.1 (0x00007ffd55bfe000)
 libtinfo.so.5 => /lib/x86_64-linux-gnu/libtinfo.so.5 (0x00007fdb3e708000)
 libdl.so.2 => /lib/x86_64-linux-gnu/libdl.so.2 (0x00007fdb3e504000)
 libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007fdb3e113000)
 /lib64/ld-linux-x86-64.so.2 (0x00007fdb3ec4c000)
```

so we need to move those libs to their dedicated folders

```bash
root@6639a75f6ca3:/# cp /lib/x86_64-linux-gnu/libtinfo.so.5 /lib/x86_64-linux-gnu/libdl.so.2 lib/x86_64-linux-gnu/libc.so.6 my-new-root/lib
root@6639a75f6ca3:/# cp /lib64/ld-linux-x86-64.so.2 my-new-root/lib64/
```

after moving we can now change the root to our new root directory and start a bash session

```bash
root@6639a75f6ca3:/# chroot my-new-root bash
```

🔴 if you try to use any command you'll notice there are no commands to be executed, that's because all we've got inside this new root is the bash only

you will notice two important things:

* now our root directory is my-new-root and we can't reach outside this environment now

* if we want to add a new command, for example, we've to explicitly do this by moving the command from whatever it resides in our host and moving it's libs to our `chroot` environment

So what's the problem with chroot?

## Namespaces

### What are Namespaces? 🤔

> ***Namespaces are a feature of the Linux kernel that partitions kernel resources such that one set of processes sees one set of resources while another set of processes sees a different set of resources***

The idea of namespaces is to let each process take its own process IDs, network layer, resources, etc to avoid conflict with other processes.

There are more than one type of namespace, for example:

A [**process ID (PID) namespace**](https://man7.org/linux/man-pages/man7/pid_namespaces.7.html) assigns a set of PIDs to processes that are independent of the set of PIDs in other namespaces. The first process created in a new namespace has PID 1 and child processes are assigned subsequent PIDs. If a child process is created with its own PID namespace, it has PID 1 in that namespace as well as its PID in the parent process’ namespace.

<img src="https://cdn.hashnode.com/res/hashnode/image/upload/v1670159658259/-9brMk2EK.png" />

From the image above, we can see that:

* the `PID namespace 1(parent)` can see child namespaces PIDs, but the child can't see outsidelves

* in each namespaces, the first process is `PID 1`

To demonstrate this idea in practice, let's get our hands dirty and start a long-running process inside your main container

```bash
root@6639a75f6ca3:/ echo "top secret" >> /my-new-root/secret.txt
root@6639a75f6ca3:/ tail -f my-new-root/secret.txt
```

after that connect to the same main container from another shell

```bash
docker exect -it docker-host bash
```

From the `Docker host 2` you've just connected to, we're going to list all the processes

```bash
# Docker-host 2
root@6639a75f6ca3:/# ps aux
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.0  18520  3348 pts/0    Ss   21:21   0:00 bash
root          46  0.0  0.0   4580   832 pts/0    S+   21:38   0:00 tail -f secret.txt
root          47  0.1  0.0  18520  3376 pts/1    Ss   21:41   0:00 bash
root          58  0.0  0.0  34416  2904 pts/1    R+   21:42   0:00 ps aux
```

🔵😃 notice that we see the `tail -f` and `bash [47]` from our chroot environment.

let's kill that process

```bash
// Docker-host 2
kill 46
```

you'll notice that the process got terminated from `Docker host 1`

```sh
// Docker-host 1
root@6639a75f6ca3:/# tail -f secret.txt
secret
Terminated
```

so with namespaces, we can solve this problem by isolating each process from seeing what other processes are doing! we'll use a command called `unshare`

### 🧪 A practical example

1. we'll create a child process (jailed process)

2. then we'll unshare \[processes, file systems, network layer\] from that child process

3. from docker host 2 we'll see how each host can control the child process but the child cannot

using `debootstrap` which is used to bootstrap a new environment and you can chroot the directory into it.

```sh
// Docker host 1
$ apt-get update
$ apt-get install debootstrap -y
// creating a new bare minimal set of a file system we need to run a debian based ubuntu
$ debootstrap --variant=minbase bionic /better-root
```

then we can unshare this newly created environment

```sh
// Docker host 1
$ unshare --mount --uts --ipc --net --pid --fork --user --map-root-user chroot /better-root bash
root@6639a75f6ca3:/# ps aux
Error, do this: mount -t proc proc /proc
# we need to mount a process first
$ mount -t proc none /proc mount -t sysfs none /sys mount -t tmpfs none /tmp
```

> **from the host we can see inside the child, from a child we can't see outside of itself**

```plaintext
# Docker-host 1
$ echo "sample" >> sample.txt
$ tail -f sample.txt

# Docker-host 2
root@6639a75f6ca3:/# ps aux
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.0  18520  3356 pts/0    Ss   21:21   0:00 bash
root          47  0.0  0.0  18520  3396 pts/1    Ss   21:41   0:00 bash
root        7406  0.0  0.0   4532   772 pts/0    S    21:53   0:00 unshare --mount --uts --ipc --net --pid --fork --user --map-root-user chroot /better-root bash
root        7407  0.0  0.0  18512  3424 pts/0    S    21:53   0:00 bash
root        7427  0.0  0.0   4572   768 pts/0    S+   22:05   0:00 tail -f sample.txt
root        7428  0.0  0.0  34416  2928 pts/1    R+   22:05   0:00 ps aux

$ kill 7427

# Docker-host 1
root@6639a75f6ca3:/# tail -f sample.txt
welcome
Terminated
```

🟢 **the host can control everything that's happening inside the child process, but the child process can't see outside itself**

## Control groups (Cgroups)

A control group (cgroup) is a Linux kernel feature that limits, accounts for, and isolates the resource usage (CPU, memory, disk I/O, network, and so on) of a collection of processes.

Cgroups provide the following features:

* **Resource limits** – You can configure a cgroup to limit how much of a particular resource (memory or CPU, for example) a process can use.

* **Prioritization** – You can control how much of a resource (CPU, disk, or network) a process can use compared to processes in another cgroup when there is resource contention.

* **Accounting** – Resource limits are monitored and reported at the cgroup level.

* **Control** – You can change the status (frozen, stopped, or restarted) of all processes in a cgroup with a single command.

<img src="https://cdn.hashnode.com/res/hashnode/image/upload/v1670160480614/wr1G6-1Sz.png" />
### Creating a Cgroup

The following command creates a v1 cgroup (you can tell by pathname format) called `foo` and sets the memory limit for it to 50,000,000 bytes (50 MB).

```bash
root # mkdir -p /sys/fs/cgroup/memory/foo
root # echo 50000000 > /sys/fs/cgroup/memory/foo/memory.limit_in_bytes
```

```bash
root # ./test.sh &
[1] 2428
root # cgroup testing tool
root # echo 2428 > /sys/fs/cgroup/memory/foo/cgroup.procs
```

```bash
root # ps -o cgroup 2428
CGROUP
12:pids:/user.slice/user-0.slice/\
session-13.scope,10:devices:/user.slice,6:memory:/foo,...
```

### 🧪 Practical example

```bash
// Docker host 1
apt-get install cgroup-tools htop

/better-root cgcreate -g cpu,memory,blkio,devices,freezer:/sandbox # creates a new cgroup for us
/better-root unshare --mount --uts --ipc --net --pid --fork --user --map-root-user chroot /better-root bash
now we are inside better-root enviroment

# docker host 2
$ cgclassify -g cpu,memory,blkio,devices,freezer:sandbox 7605 (#pid of bash inside docker host 1, now bash process and every chid process inside it inside control group)
$ cat /sys/fs/cgroup/cpu/sandbox/tasks # to see what's inside control group
$ cat /sys/fs/cgroup/cpu/sandbox/cpu.shares #(priority)

## now let's limit what's happening
$ cgset -r cpu.cfs_period_us=100000 -r cpu.cfs_quota_us=$[ 5000 * $(getconf _NPROCESSORS_ONLN) ] sandbox
  # this limit process to only use 5% of the avaialble processing power
$ cgset -r memory.limit_in_bytes=80M sandbox
  # this limit process to use only 80M if it exceeds this amount, it will run out of memory
$ cgget -r memory.stat sandbox # to see statistics of memory you gave to sandbox

## To see this in practice
let's pin the cpu for use in docker host 1 (do a heavy work)
# Docker host 1
$ yes > /dev/null (print yes forever in /dev/null) [A long and heavy runnin process]

## From docker host 2
$ htop # notice something

### Let's mess another one but this time with memory
# Docker host 1
$ yes | tr \\n x | head -c 104857600| grep n (contiuly fill our memory until we run out of memory)
## Docker host 2
$ htop # notice something about the memory
```

Congratulations, you've now created a container by hand this is what docker does for you beneath, but with more responsibilities

## Resources

You can dig deeper by reading about those features in detail

* [How to use chroot - howtogeek](https://www.howtogeek.com/441534/how-to-use-the-chroot-command-on-linux)

* [Resource Management using cgroups - Red Hat](https://access.redhat.com/documentation/enus/red_hat_enterprise_linux/6/html/resource_management_guide/ch01)

* [What are namespace, cgroups in linux kernerl - Nginx blog](https://www.nginx.com/blog/what-are-namespaces-cgroups-how-do-they-work/)

* [How Docker works - LiveOverflow](https://www.youtube.com/watch?v=-YnMr1lj4Z8)

* [What are containers are made of - Docke conference](https://www.youtube.com/watch?v=sK5i-N34im8)

* [http://docker-saigon.github.io/post/Docker-Internals](http://docker-saigon.github.io/post/Docker-Internals)
