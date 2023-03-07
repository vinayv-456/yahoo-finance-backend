const express = require("express");
const router = express.Router();
var yahooFinance = require("yahoo-finance");
const bodyParser = require("body-parser");
const {companies: allCompanies} = require("../constants/companies");
const {
  getCompaniesData,
  getCompaniesMeetingCondition,
} = require("../utilities/contituents");

router.use(bodyParser.json());
router.post("/contituents", async (req, res) => {
  try {
    const {pageSize, marketCap, startIndexInit} = req.body;
    const allModules = [
      "price",
      // "summaryDetail",
      "financialData",
    ];
    if (!marketCap) {
      const startIndex = startIndexInit || 0;
      const endIndex = startIndex + pageSize;
      console.log("startIndex", startIndex, endIndex);
      const companies = allCompanies.slice(startIndex, endIndex);
      console.log("fetching........", companies);
      const resp = await getCompaniesData({
        companies,
        modules: allModules,
        countRequired: pageSize,
      });
      console.log("response sent......");
      res.status(200).send({
        ...resp,
        indexStart: startIndex,
        hasPrevPage: startIndex > 0,
        indexReached: endIndex,
        hasNextPage: allCompanies.length > endIndex,
      });
      // res.send({});
    } else {
      const condition = (val) => val > marketCap * 1000000000;
      const {data: partialData, indexReached} =
        await getCompaniesMeetingCondition({
          condition,
          startIndexInit,
          pageSize,
          modules: ["price"],
        });
      console.log("=====finalized companies=========");
      if (partialData) {
        console.log("aaa", Object.keys(partialData));

        const data = await getCompaniesData({
          companies: Object.keys(partialData || {})?.slice(0, pageSize),
          modules: allModules.slice(0),
        });
        console.log("indexReached===22222", indexReached);
        res.status(200).send({
          ...data,
          indexStart: startIndexInit || 0,
          hasPrevPage: startIndexInit > 0,
          indexReached,
          hasNextPage: Object.keys(partialData).length > pageSize,
        });
      } else {
        res.status(200).send({});
      }
      // console.log("data", data);
    }
  } catch (e) {
    console.log("err", e);
    res.status(400).send({});
    // res.send(createResponse(true, null, e.message));
  }
});
module.exports = router;
// aaa [ 'ME', 'ALHC', 'MDRX', 'AMLX', 'AAPL' ]
