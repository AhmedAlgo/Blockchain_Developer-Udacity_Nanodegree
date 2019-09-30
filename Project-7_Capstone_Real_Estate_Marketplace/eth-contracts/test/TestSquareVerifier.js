// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
var SquareVerifier = artifacts.require('SquareVerifier');

contract('SquareVerifier', accounts => {

  const account_one = accounts[0];

  console.log(account_one);

  //data from proof.json(zokrates)
  const zokrates_proof = {
    "proof":
      {
        "A":["0x2afa6bc677752b88577ead1effbb3dd3e294dbde82c50f28da2cce4c302d828d", "0x18742adff822521c89f45797f15259395da13326d1252f42bc57a648eec10152"],
        "A_p":["0x23582277fabf254237194592c892486a7d9cc08b49226352c0b880538dea9c55", "0x2ffcd66d870f7784271a372ee4ce918f72f47dada09570dab41ce65ada5ebbb"],
        "B":
          [["0x1f747688ee5408ed5cad520346826fec76f7d523b3921963fea4629220638ac", "0x191168961e8a8861335af7c253ffcaeaf3a0db403120115b1e6c52869d2b9d89"], ["0xb7995a1503c76abc30e42921511d52ef024483e358489f4e2028bf159c9a036", "0x190759270841f13bccd059d102991b32fe2b2d51aa4042a13bb3497c708f6bb"]],

        "B_p":["0x4bc3109aad8522e950cc23b404790c36ea47bb20a996c223c1377733e317dbc", "0x2ca1917cc3fd553ff5eeab2c5e29eab71e859ae10f403db68d9e672575d0b4b3"],
        "C":["0x24d08148498f42ca3957263e8f64a94da06da55f69393d21385baea6ea88f4fc", "0x123eb9feadcbad99df1659e39e1724b8c92e731e1040cdfaabfeac34e5b38ef9"],
        "C_p":["0x1131fbb6bc562094a0c4a1d256c92c1e998f73080ffa72e8f5b32de7cad48a15", "0xb93d7a2fe629f3e33be0c97bfd01ca21e554ca67fe0c5594e6425e4442b42ae"],
        "H":["0x2b00b6db8d650c5c009191e01540d92bcbd1b68b048cee6835931403fe0761a1", "0x2353a7e3e73482376f0d59a8b845d965abed0ed998f8c513dda77a5d474757c"],
        "K":["0xb5f233bf077250459324c04000560af2c1b6ddb9f52615938ef68ede9af7a62", "0x2a27bb10fdf6283aa9d759edf1546cfe206ec3a5b160a4369ca79d1462b39605"]
      },
    "input":[9,1]
  };


// Test verification with incorrect proof

  describe('verification with correct and incorrect proof', function () {
    beforeEach(async function () {
      this.contract = await SquareVerifier.new({from: account_one});
    });

    //verify correct proof
    it('test verify correct proof', async function () {
      let result = await this.contract.verifyTx.call(zokrates_proof.proof.A,
        zokrates_proof.proof.A_p,
        zokrates_proof.proof.B,
        zokrates_proof.proof.B_p,
        zokrates_proof.proof.C,
        zokrates_proof.proof.C_p,
        zokrates_proof.proof.H,
        zokrates_proof.proof.K,
        zokrates_proof.input,
        {from: accounts[0]}
      );
      assert.equal(result, true, "Verification was not valid (it should be");
    });

    //alter a value to make the proofing data wrong
    let wrongA_p = ["0x163dc17303650f735e6ccbcef77192c536a70a1fd08d690343f4d6bc5c226728", "0xa55996fcad1f1149651709eeac5d52d04ad258b17da2f76cd5a1e94f083f34a"];
    it('test verify wrong proof', async function () {
      let result = await this.contract.verifyTx.call(zokrates_proof.proof.A,
        wrongA_p,
        zokrates_proof.proof.B,
        zokrates_proof.proof.B_p,
        zokrates_proof.proof.C,
        zokrates_proof.proof.C_p,
        zokrates_proof.proof.H,
        zokrates_proof.proof.K,
        zokrates_proof.input,
        {from: account_one}
      );
      assert.equal(result, false, "Verification was valid (it should not be");
    });


  });




});
