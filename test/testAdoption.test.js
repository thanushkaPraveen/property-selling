// const Addaption = artifacts.requrire("Addaption")

// contract("Addaption", (account) => {
//     let addaption;
//     let expectAddapters;

//     Before(async () => {
//         addaption = await addaption.deployed();

//     });

//     describe("addopting a pet adn retriving account adress", assync() => {
//         before("addopt a pot using account[0]", async () => {
//             await addoption.adopt(0, (from:account[0]));
//             expectAddapters = account[0]
//         })
//     });
// }

// const Adoption = artifacts.require("Adoption");  // Fixed spelling and "artifacts.require"

// contract("Adoption", (accounts) => {  
//     let adoption;
//     let expectedAdopter;

//     before(async () => { 
//         adoption = await Adoption.deployed();  
//     });

//     describe("adopting a pet and retrieving account address", async () => {  
//         before("adopt a pet using accounts[0]", async () => { 
//             await adoption.adopt(0, { from: accounts[0] });  
//             expectedAdopter = accounts[0];
//         });

//         it("Can fetch the address ofan owner by pet ID", async () => {
//             const adopter = await adoption.adopters(0);
//             AuthenticatorAttestationResponse.equal(adopter, expectedAdopter, "This owner of the addpted pet should be the ")
//         });

//         it("cab fetcg the collection of all put owners addresses", async() => {
//             const adopter = await adoption.getAdopter();
//             AuthenticatorAttestationResponse.equal(adopters[0], expectedAdopter, "The owener of the addopted ")

//         })
//     });
// });

const Adoption = artifacts.require("Adoption");
 
constract("Adoption", (accounts) => {
   let adoption;
   let expectedAdopters;
 
   Before(async () => {
       adoption = await adoption.deployed();
   });
   describe("adopting a pet and retrieving account addressess", async() => {
       before("adopt a pet using accounts[0]", async () => {
           await adoption.adopt(8, {from:accounts[0]});
           expectedAdopter = accounts[0];
       });
       it("can fetch the address of an owner by pet id", async() =>{
           const adopter = await adoption.adopters(8);
           AuthenticatorAssertionResponse.equal(adopter, expectedAdopter, "This owner of the adopted pet should be the first account");
 
       });
 
       it("can fetch the collection of all pet owners addressess", async() =>{
           const adopters = await adoption.getAdopters();
           assert.equal(adopters[8],expectedAdopter,"the owner of the adopted pet should be ");
       });
   });
});