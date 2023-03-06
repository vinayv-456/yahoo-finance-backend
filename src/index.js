var http = require("http");
var yahooFinance = require("yahoo-finance");

//create a server object:
http
  .createServer(function async(req, res) {
    // yahooFinance.historical(
    //   {
    //     symbol: "MSFT",
    //     from: "2021-04-26",
    //     to: "2021-04-27"
    //   },
    //   function (err, quotes) {
    //     res.write(JSON.stringify(quotes[0])); //write a response to the client
    //     res.end(); //end the response
    //   }
    // );
    yahooFinance.quote(
      {
        symbol: "ME",
        modules: ["price", "summaryDetail"],
      },
      function (err, quote) {
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
        console.log(err, "erroe");
        console.log(quote, "queto");
        res.write(JSON.stringify(quote)); //write a response to the clients
        // res.write(quote);
        res.end();
      }
    );
  })
  .listen(8080); //the server object listens on port 8080
