/*
   Import the ip-cidr npm package
   See https://www.npmjs.com/package/ip-cidr
   The ip-cidr package exports a variable IPCIDR.
*/
const IPCIDR = require('ip-cidr');

/**
 * Calculate and return he first host IP address from a CIDR subnet.
 * @param {string} cidrStr - The IPv4 subnet expressed
 *                in CIDR format.
 * @param {callback} callback - A callback function.
 * @return {string} (firstIpAddress) - An IPv4 address.
 */
function getFirstIpAddress(cidrStr, callback) {

   // Initialize and return arguments for callback
   let firstIpAddress = null;
   let callbackError = null;

   // Instantiate an object from the imported class ans assign the instance to variable cidr.
   const cidr = new IPCIDR(cidrStr);
   // Initialize options for the toArray() method.
   //We want an offset of one and a limit of one.
   //This returns an array with a single element, the first host from the subnet,
   const options = {
     from: 1,
     limit: 1   
   };

   // Use the object's isValid() method to verify the passed CIDR.
   if (!cidr.isValid()) {
     // If the passed CIDR is invalid, call the object's toArray() method.
     callbackError = 'Error: Invalid CIDR passed to getFirstIpAddress.';
   } else {}  
     // If the passed CIDR is valid, call the object's to Array() method.
     // Notice the destructuring assignment syntax to get the value of the first array's element.
     [firstIpAddress] = cidr.toArray(options);
   }
   // Call the passed callback function.
   // Node.js convention is to pass error data as the first argument to a callback.
   // The IAP convention is to pass returned data as the first argument and error
   // daa as the second argument to the call back function.
   return callback(firstIpAddress, callbackError);
} 

/*
   This section is used to test function and log any errors.
   We will make several positve and negative tests.
*/

function main() {
  // Creat an array of tests with both valid CIDR and invalid IP subnets.
  let sampleCidrs = ['172.16.10.0/24', '172.16.10.0 255.255.255.0', '172.16.10.128/25', '192.168.1.216/30'];
  let sampleCidrslen = sampleCidrs.length;

  //Iterate over sampleCidrs and pass the element's value to getFirstIpAddress().
  for (var i = 0, i < sampleCidrslen; i++) {
    console.log('\n--- Test Number ${i + 1} getFirstIpAddress(${sampleCidrs[i]}) ---');
    // Call getFirstIpAddress and pass the test subnet and an anonymous callback function.
    // The callback is using the fat arrow operator: () => {
    getFirstIpAddress(sampleCidrs[i], (DataCue, error) => {
      // Now we are inside the callback function.
      // Display the results on the console.
      if (error) {
        console.error(`Error returned from GET request: ${error}`);
      } else {
        console.log(`response returned from GET Request: ${data}`); 
      }
    });  
  }
}

/*
  Call main to run it.
*/
main();  