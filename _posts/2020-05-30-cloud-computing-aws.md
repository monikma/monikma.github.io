---
layout: post
title: AWS Cloud Computing Notes
date: '2020-05-30'
author: Monik
tags:
- Programming
- Node.js
- Express
- AWS
- Microservices
- Cloud_Computing
commentIssueId: 39
---
<div class="bg-info panel-body" markdown="1">
Those are the notes I took during the Cloud Developer Udacity Course, as well as during doing my projects in that topic.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=1}

## Intro

Why cloud? Because this way we can handle **more load** and/or have more **computational power**.

A **cluster** is a collection of instances which perform the same function. An **autoscaling group** is a type of cluster that can increase or decrease the number of instances based on demand.

**Tightly coupled** systems are fast to stand-up but have a lot of technical debt. It is better to keep things loosely coupled. One extra advantage is that it is easy to outsource parts of the system. You should however not obsess too much over reducing technical debt, just keep in mind.

For REST **API Design** keep the resource endpoints to be nouns in their plural form.


## Environment setup

- [Node and NPM](https://nodejs.com/en/download)
- [Ionic Cli](https://ionicframework.com/docs/installation/cli) - to serve and build the frontend
- Python3
- Amazon Web Services (AWS) Free Tier
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) - also, some commands are not yet in AWS Console
- Postbird - db client
- Postman - HTTP client, API tests

We will use Node Express and TypeScript. Course repo: https://github.com/udacity/cloud-developer.

How to install dependencies in Node:
- `npm i bcrypt --save` - install `bcrypt`, and add it to `package.json` dependencies
- `npm i --save-dev @types/bcrypt` - install types for `bcrypt` and add it to `package.json` developer dependencies

### Starting Node Express server

First, run this in the project folder:

`npm install`

Notice the following in the code, which will parse the JSON body automatically:
 
`app.use(bodyParser.json());`

To start the server run:

`npm run dev`

**Testing**
- For unit tests we use **Chai/Mocha** framework.
- For integration tests we use **Postman**. Postman has a test suite functionality, as well as URL placeholders that allow making requests to the same endpoints in different environments. 

**Third party libraries**
- for npm libraries, remember to check the license, how well the library is supported, and if it has test coverage listed

## Data Storage

**NoSQL** databases are easily scaled out, be careful not to create a mess with the dynamic schema just because you do not actually know what you are building.
**Relational databases** are still a good choice in many cases, they are easy to scale up

Bloom Filters - interesting

### Databases in AWS

**Create SQL database**
- RDS -> Create database -> PostgreSQL
- make sure you check Free Tier checkbox!
- give it a name, username, password
- VPC ignore for now
- make it publicly accessible to be able to access it from your dev machine
- again a name, port
- enable monitoring, export logs, the rest default

**Allow access from outside (dev)**

**VPC** (Virtual Private Cloud) is like a Firewall which will still block the connections from out dev machine. In order to fix that:

- click on the database's VPC
- for **Inbound** change it to have:
```
Postgres    TCP     5432    0.0.0.0
Postgres    TCP     5432    ://0
```

(you will get the two rows just by choosing "Anywhere")

### Filestores in AWS

They are good for storing binary data, cheaper than storing them in a database. AWS provides:
- S3
- S3 Glacier for archiving
- Monitoring filestores
- CDNs (data cached close to user)

For uploading to AWS we will use the **Signed URL Pattern**: the client will get an expiring self-authenticating URL to upload the file themselves.

**Create the S3 filestore**

- S3 -> Create bucket 
- remember that the name is globally unique
- if possilbe enable ecryption
- keep public access blocked

**Update CORS for the S3 filestore**

For Signed URL pattern to work, you need to update CORS for that Bucket.
 - Bucket -> Permissions - CORS, replace with this:
```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

**Configure user and service access to the S3 bucket**

It is very important that any access in the cloud is revokable, and as limited as possible. Also, it is better have user groups rather than single policies added to each user (maintenance).

**IAM** - is Amazon's permission management. It applies to users and services.

To configure user access:

- create a new user (for dev env)
- check programmatic access (cli), AWS Console
- create user group and add the user to the group
- create new policy, to access the s3 bucket; we can create access only for this particular bucket (using ARN)
- download user's credentials (*)

To use the configured user access you need to install the IAM credentials locally:

- run `aws configure`
- enter the credentials you downloaded here (*); note this will be saved in ~/.aws/config (unix), you can see there that the default profile is called `default`

To configure service access:

- add a new server role for EC2 (that you will add in the future)
- add the new policy to the role


## Deploy your service to AWS

This is about putting what we have locally into the cloud. AWS offers a deployment tool called **Elastic Beanstalk**. It adds Load Balancer, NGIX Proxy (ssl, queuing requests if too many), automatic scaling.

*** Temporarily, you need to add an admin policy to your dev user, to make him be able to crete the EB. Later you can remove it.

We can use the distribution for Node.

- download and install [EB Cli](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html) (for Windows it may sound complicated, but don't give up, remember you can run the cmd in Administrator mode in Windows too)
- run `eb init`
- choose no codeCommit
- choose to setup SSH (for generating SSH pair, see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html)

The configuration will be written into `config.yml`. Add there:
```
deploy:
  artifact: ./www/Archive.zip   
```
- for Windows install [UnxUtils](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/nodejs-dynamodb-tutorial.html#nodejs-dynamodb-tutorial-prereqs) (stay brave)

In the `package.json` -> script -> build there is a little trick of preparing that `*.zip` file that AWS accepts, all in one line.

(`.npmrc` is a file for npm, tells it how to install dependencies)

- run `npm run build` to have the `Archive.zip` created
- run `eb create` to have everything deployed to AWS with Elastic Beanstalk
- you can take the defaults, for Load Balancer choose "Application"
- in AWS Console update the env variables (Configuration -> Software -> Modify -> Env. variables)

Note that the profile is now `DEPLOYED`, this is because in the code there is an `if` not to copy the IAM local credentials in such case:
```
 if(c.aws_profile !== "DEPLOYED") {
   var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
   AWS.config.credentials = credentials;
 }
```
- finally, add our new s3 bucket policy to the role of that EC2 (lazy solution, normally you'd create a dedicated role)

*** You can now remove the admin policy from your dev user.

#### Deploying changes

If you need to deploy code changes to AWS:
- `npm run build`
- `eb deploy`

## Security

Common errors:
- do not log passwords
- do not commit passwords to git
- do not send passwords without SSL
- do not store passwords plaintext, hash them
- to avoid rainbow table attack in case of hash leak, hash them with a random (long enough) salt, using `bcrypt` not `MD5` (as of 2019)

Salt is generated also using hash algorithm/library. Salt is stored in the database, together with the hashed password. 

**Hash and compare the user password with bcrypt**

To hash it:
```
const rounds = 10; //2^10 rounds
const salt = await bcrypt.genSalt(rounds);
const hash = await bcrypt.hash(plain, salt);
```

To compare the password with the hash (under the hood the salt is extracted from the hash to hash the `plain` with it):
```
await bcrypt.compare(plain, hash);
```

### Storing user authentication in the browser

Once the user enters their correct password, the server can respond with an information that the browser can use for a limited time, in order to authenticate the user without them needing to re-enter the password each time. For example:
- server responds with a session id that is stored in a local cookie
- server responds with a [JWT token](https://jwt.io/introduction/) that is stored e.g. in Browser's local storage; *In short JWT token is a self signed content that the author (in that case the server) can then decrypt later;*

### Storing service authentication in the service

That happens using authorization tokens. The server gets a token from another server, and can use it for subsequent calls. Remember, store the secrets in environment variable.

### JWT tokens

(A JWT contains `header`.`user data`.`the two encoded`, encoded with a secret that is known only by the server. So that is how it is read-only. And if 2 services use same secret then we have SSO out of the box.)

#### Creating JWT
```
return jwt.sign(user, config.jwt.secret);
```

#### Verifying JWT

We add a `requireAuth` function as an [Express Middleware](https://expressjs.com/en/guide/writing-middleware.html).

```
export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers || !req.headers.authorization){
         return res.status(401).send({ message: 'No authorization headers.' });
    }
    
    const token_bearer = req.headers.authorization.split(' ');
    if(token_bearer.length != 2){
        return res.status(401).send({ message: 'Malformed token.' });
    }
    
    const token = token_bearer[1];

    return jwt.verify(token, "hello", (err, decoded) => {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
      }
      return next();
    });
}
```

In the router we protect the endpoint with `requireAuth` like this:
```
router.patch('/:id',
    requireAuth, 
    async (req: Request, res: Response) => {
    ...
```

### Managing user credentials in AWS

AWS Cognito.

### Security resources

You should have a **Security Policy** at your company.

Security Policy examples:
- [NPM](https://www.npmjs.com/policies/security)
- [Nylas](https://www.nylas.com/security/)
- [AWS](https://www.nylas.com/security/)

Other resources:
- [owasp.org](https://www.owasp.org/index.php/OWASP_Top_Ten_Cheat_Sheet)
- [npm auditing](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities)
- [github security alerts](https://help.github.com/en/articles/about-security-alerts-for-vulnerable-dependencies)

## Maintenance, scaling, etc

### DNS

Amazon's DNS is called [Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html). Functionalities:
- domain registration
- DNS routing
- health checking

It allows you to point directly to the AWS infrastructure (e.g. referring by resource name).

DNS stores:
- A records - which point to sepcific server
- CNAME - which are name aliases

### Ionic client with Angular - supre basics

With Ionic (also React) you can move your app to the mobile using something called hybrid app.

You need [Ionic cli](https://ionicframework.com/docs/cli) installed globally (see the link). 

- run `ionic serve` to start the frontend server. 
- open `http://localhost:8100/home`

### CDN

You can put the whole frontend into the CDN. 

For that you need to:
- produce a build artifact: 
  - `ionic build` - will process TS files to JS, also process HTML
  - `ionic build --prod` - with use settings saved in `environment.prod.ts`
- upload the build artifact to a S3 bucket
- link the bucket with a CloudFront distribution, see [AWS docs](https://aws.amazon.com/premiumsupport/knowledge-center/cloudfront-serve-static-website/)
  
### Scaling

AWS can automatically manage instances depending on the load - that is called auto-scaling. 

#### Scaling up

In AWS there are instance types - specialized to better handle certain situations. This you set in Elastic Beanstalk.

#### Scaling out

Is adding more server instances, after scaling up is not possible anymore. Also Load Balancer comes into play then. 

We also configure it in Elastic Beanstalk:
- click on your application
- click *Configuration*
- click *Capacity*

See *Scaling triggers* - there you can set the thresholds. The documentation is [here](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environments-cfg-autoscaling-triggers.html).

#### Database

Can also be scaled, up and out. See the [docu](https://aws.amazon.com/blogs/database/scaling-your-amazon-rds-instance-vertically-and-horizontally/).

#### Debugging on the cloud

Troubleshooting:

If Elastic Beanstalk status is red 
- check "Health" and HTTP codes %
- check "Logs"

Other tools:
- https://sentry.io/ - intercepts any errors and gives an overview of them, also maps JS to TS
- Siege cli - lets you simulate many concurrent requests to test concurrency
- CloudFlare - for improved DNS with monitoring and fail-over capabilities (like analytics)
- DataDog - for stack performance and health status (like profiling)
- CloudWatch - AWS native tools to help monitor the performance