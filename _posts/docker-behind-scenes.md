- running single containers

# Essentials

docker run -it ubuntu /bin/bash

<ubuntu> is the image which comes from docker hub

with docker you're always running a single process, and the continer is running as long as this process is running

docker ps -> showing only running containers
docker ps -a -> show all
docker start <option> => start the image
docker attatch <option> => to start and run the image
docker stop <option> =>
docker rm <option>

- running multiple containers

-

## Resources

- [ ] Docker in action
- [ ] <https://www.youtube.com/playlist?list=PLX1bW_GeBRhDkTf_jbdvBbkHs2LCWVeXZ>

## Table of Contents

1. Process Isolation and enviroment-independent computing
2. Packaging software for distribution.
3. Higher-level abstractions and orchestration.
