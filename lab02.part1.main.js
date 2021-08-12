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
   } else { 
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

function getIpv4MappedIpv6Address(ipv4) {
  let ipv6Address = null; 
  let ipv4Quads = ipv4.split('.');
  let numIpv4Segments = ipv4Quads.length;
  if (numIpv4Segments === 4) {
    let validQuads = true;
    for(let i=0; i < numIpv4Segments; i++) {
      if( isNaN(Number(ipv4Quads[i]))  || ipv4Quads[i] < 0 || ipv4Quads[i] > 255 ) {
        validQuads = false;
      }
    }
    if (validQuads) {
      ipv6Address = "0:0:0:0:0:ffff:";
      for(let i=0; i < numIpv4Segments; i++) {
        let hexString = parseInt(ipv4Quads[i]).toString(16);
        if (hexString.length % 2)
          hexString = '0' + hexString;

        ipv6Address = ipv6Address + hexString;
        if(i===1) {
          ipv6Address = ipv6Address + ':';
        }  
      }
    }
  }
  return ipv6Address;
}

function main() {
  // Creat an array of tests with both valid CIDR and invalid IP subnets.
  let sampleCidrs = ['172.16.10.0/24', '172.16.10.0 255.255.255.0', '172.16.10.128/25', '192.168.1.216/30'];
  let sampleCidrslen = sampleCidrs.length;
  let sampleIpv4s = ['172.16.10.1', '172.16.10.0/24', '172.16.10.0 255.255.255.0', '172.16.256.1', '1.1.1.-1'];
  let sampleIpv4sLen = sampleIpv4s.length;
  for (var i = 0; i < sampleCidrslen; i++) {
    console.log(`\n--- Test Number ${i + 1} getFirstIpAddress(${sampleCidrs[i]}) ---`);
    // Call getFirstIpAddress and pass the test subnet and an anonymous callback function.
    // The callback is using the fat arrow operator: () => {
    getFirstIpAddress(sampleCidrs[i], (data, error) => {
      // Now we are inside the callback function.
      // Display the results on the console.
      if (error) {
        console.error(`  Error returned from GET request: ${error}`);
      }
        console.log(`  Response returned from GET Request: ${data}`); 
    });  
  }
  for(let i =0; i < sampleIpv4sLen; i++) {
    console.log(`\n--- Test Number ${i + 1} getIpv4MappedIpv6Address(${sampleIpv4s[i]}) ---`); 
    let mappedAddress = getIpv4MappedIpv6Address(sampleIpv4s[i]);
    if( mappedAddress ) {
       console.log (`  IPv4 ${sampleIpv4s[i]} mapped to IPv6 Address: ${mappedAddress}`);
    } else {
      console.error(`  Problem converting IPv4 ${sampleIpv4s[i]} into a mapped IPv6 address.`);  
    }  
  } 
}
/*
  Call main to run it.
*/
main();  