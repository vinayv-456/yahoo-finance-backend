const express = require("express");
const router = express.Router();
var yahooFinance = require("yahoo-finance");
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.post("/contituents", async (req, res) => {
  try {
    const {companies} = req.body;
    console.log("testttt", req.body.companies);
    yahooFinance.quote(
      {
        symbols: companies,
        modules: [
          "price",
          // "summaryDetail",
          "financialData",
        ],
      },
      function (err, quote) {
        const data = companies.reduce((overall, company) => {
          const details = quote[company];
          const {price, summaryDetail, financialData} = details;
          console.log("det", price);
          return [
            ...overall,
            {
              company: price?.shortName,
              symbol: price?.symbol,
              exchange: price?.exchangeName,
              price: price?.regularMarketPrice,
              revenueGrowth: financialData?.revenueGrowth,
              ebitdaMargins: financialData?.ebitdaMargins,
              grossMargins: financialData?.grossMargins,
            },
          ];
        }, []);
        // data.push({
        //   company: quote.price.shortName,
        //   symbol: quote.price.symbol,
        //   exchange: quote.price.exchangeName,
        //   price: quote.price.regularMarketPrice,
        //   currency: quote.price.currency,
        //   dividendRate: quote.price.dividendRate,
        //   dividendYield: quote.price.dividendYield,
        //   exDividendDate: quote.price.exDividendDate,
        // });

        // console.log(err, "erroe");
        // console.log(quote, "queto");
        // res.write(JSON.stringify(quote)); //write a response to the clients
        // res.write({});
        // res.end();
        res.status(200).send(data);
      }
    );
  } catch (e) {
    console.log("err", e);
    // res.send(createResponse(true, null, e.message));
  }
});
module.exports = router;
