# Microservice-Blog

This is a toy project using Kubernetes to connect different microservice. It is a blog application where you can post
and comment each post. Different services run in different pods that govered by Kubernetes.

To start the application, go to Infra/k8s and use below command to deploy files end with .yaml except ingress-srv.yaml:
kubectl apply -f <file_name> 

Make sure you have ingress-nginx installed and use the same command below to config ingress rules:
kubectl apply -f ingress-srv.yaml

Change your local host file, on mac you can use below command to access the hosts file:
nano /etc/hosts

and adding below line at the end:
127.0.0.1 posts.com

Then you can access the application with posts.com/posts
