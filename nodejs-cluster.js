

// Geshan Manandhar 
// Geshan is a seasoned software engineer with more than a decade of software engineering experience. He has a keen interest in REST architecture, microservices, and cloud computing. He also blogs at geshan.com.np.
// Optimizing your Node.js app’s performance with clustering
// August 29, 2022  8 min read 


// Editor’s note: This article was updated on 12 September 2022 to include information on what clustering in Node.js is, advantages of clustering in Node.js, as well as other general updates and revisions.

// Node.js has gained a lot of popularity in the past few years. It is used by big names like LinkedIn, eBay, and Netflix, which proves it has been battle-tested well.

// Clustering is a great way to optimize your Node.js app’s overall performance. In this tutorial, we will learn how to use clustering in Node.js to achieve these performance benefits by using all the available CPUs. Let’s get going.

// What is clustering in Node.js?
// The need for clustering in Node.js
// How does the Node.js cluster module work?
// Advantages of using clustering in Node.js
// Prerequisites
// Building a simple Express server without clustering
// Adding Node.js clustering to an Express server
// Load testing servers with and without clustering
// Final thoughts on Node.js clustering
// What is clustering in Node.js?
// Node.js, by default, does not utilize all CPU cores, even if the machine has multiple.

// On the other hand, Node.js comes with a native cluster module. The cluster module enables creating child processes (workers) that run simultaneously while sharing the same server port.
// Every child process has its own event loop, memory, and V8 instance.

// The child processes use interprocess communication to communicate to the main parent Node.js process.

// The need for clustering in Node.js
// An instance of Node.js runs on a single thread (you can read more about threads in Node.js here). The official Node.js “About” page states: “Node.js being designed without threads doesn’t mean you can’t take advantage of multiple cores in your environment.” That’s where it points to the cluster module.

// The cluster module doc adds: “To take advantage of multi-core systems, the user will sometimes want to launch a cluster of Node.js processes to handle the load.” So, to take advantage of the multiple processors on the system running Node.js, we should use the cluster module.

// Exploiting the available cores to distribute the load between them gives our Node.js app a performance boost. As most modern systems have multiple cores, we should be using the cluster module in Node.js to get the most performance juice out of these newer machines.

// How does the Node.js cluster module work?
// In a nutshell, the Node.js cluster module acts as a load balancer. It distributes a load to the child processes running simultaneously on a shared port. Node.js is not great with blocking code, so if there is only one processor and it’s blocked by a heavy and CPU-intensive operation, other requests are just waiting in the queue for this operation to complete.

// With multiple processes, if one process is busy with a relatively CPU-intensive operation, other processes can take up the other requests coming in and utilize the other CPUs/cores available. This is the power of the cluster module — workers share the load and the app does not stop.

// The master process can distribute the load to the child process in two ways. The first (and default) is a round-robin fashion. The second way is the master process listens to a socket and sends the work to interested workers. The workers then process the incoming requests.

// However, the second method is not super clear and easy to comprehend like the basic round-robin approach.

// Advantages of using clustering in Node.js
// There are some distinct advantages to using clusters in Node.js. As the Node.js app is able to utilize all the CPU resources available (given most computers these days have a multi-core CPU), it will distribute the computing load to these cores. As load is distributed and all the CPU cores are well utilized, this will result in multiple threads improving throughput (measured in requests per second)


// Over 200k developers use LogRocket to create better digital experiences
// Learn more →
// This is possible because with multiple processes ready to handle incoming requests, these requests can be processed simultaneously. Even if there is blocking or long-running tasks, only one worker is affected and other workers can continue handling other requests. Your Node.js application will not come to a halt like it could previously until the blocking operation is done.

// Another advantage of having multiple workers is the app can be updated with minimal or no downtime at all. As there are multiple workers, they can be recycled/restarted one at a time. This means one child process can replace another one gracefully and there will be no time when no workers are inactive. As you can see, this easily optimizes the speed and efficiency of an update.

// Enough of the theory, let’s have a look at some prerequisites next before diving into the code.

// Prerequisites
// To follow this guide about Node.js clustering, you should have the following:

// Node.js running on your machine, latest LTS is advisable. It is Node.js 18 at the time of writing.
// Working knowledge of Node.js and Express
// Basic knowledge on how processes and threads work
// Working knowledge of Git and GitHub
// Now let’s move into the code of this tutorial.

// Building a simple Express server without clustering
// We will start by creating a simple Express server. This server will do a relatively heavy computational task which will deliberately block the event loop. Our first example will be without any clustering.

// To get Express set up in a new project we can run the following on the CLI:

// mkdir nodejs-cluster
// cd nodejs-cluster
// npm init -y
// npm install --save express
// Then, we will create a file called no-cluster.js on the root of the project like below:

// No Cluster Js File
// The contents of the no-cluster.js file will be as follows:

const express = require('express');
const port = 3001;

const app = express();
console.log(`Worker ${process.pid} started`);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/api/slow', function (req, res) {
  console.time('slowApi');
  const baseNumber = 7;
  let result = 0;    
  for (let i = Math.pow(baseNumber, 7); i >= 0; i--) {        
    result += Math.atan(i) * Math.tan(i);
  };
  console.timeEnd('slowApi');

  console.log(`Result number is ${result} - on process ${process.pid}`);
  res.send(`Result number is ${result}`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});