var yahooFinance = require("yahoo-finance");
const {companies: totalCompanies} = require("../constants/companies");

const getCompaniesData = async ({
  companies,
  modules,
  condition,
  countRequired,
}) => {
  try {
    let data;
    let indexReached = -1;
    let foundCompanies = 0;
    console.log(
      "condition====1",
      companies,
      condition,
      countRequired,
      countRequired > foundCompanies
    );
    if (!companies.length) {
      return {data: {}, indexReached: -1};
    }
    await yahooFinance.quote(
      {
        symbols: companies,
        modules,
      },
      function (err, quote) {
        // console.log("cc", quote, modules, companies);
        // let indexReached = -1;
        data = companies.reduce((overall, company, index) => {
          if (quote?.[company]) {
            // console.log("1111", quote, company, quote?.[company]);
            const details = quote[company];
            const {price, summaryDetail, financialData} = details;
            // console.log("================det================", details);
            if (condition && !condition(price.marketCap)) {
              // skip this entry as condition is not met
              // console.log("skip");
              return overall;
            }
            if (countRequired && countRequired > foundCompanies) {
              console.log("inside count.......", index);
              indexReached = index;
              foundCompanies += 1;
            }
            // console.log("routine", condition, price.marketCap);
            return {
              ...overall,
              [price?.symbol]: {
                company: price?.shortName,
                symbol: price?.symbol,
                exchange: price?.exchangeName,
                price: price?.regularMarketPrice,
                revenueGrowth: financialData?.revenueGrowth,
                ebitdaMargins: financialData?.ebitdaMargins,
                grossMargins: financialData?.grossMargins,
                marketCap: price.marketCap,
              },
            };
          }
          return overall;
        }, {});
      }
    );
    return {data, indexReached};
  } catch (e) {
    console.log("e", e);
  }
};

const getCompaniesMeetingCondition = async ({
  condition,
  startIndexInit,
  pageSize,
  modules,
}) => {
  // const condition = (val) => val > marketCap * 1000000000;
  try {
    let startIndex = startIndexInit || 0;
    let indexReached;
    let finalData = {};
    const pageIncrements = 2;
    while (Object.entries(finalData).length < pageSize) {
      const companies = totalCompanies.slice(
        startIndex,
        startIndex + pageIncrements * pageSize
      );
      const {data: itrData, indexReached: indexReachedVal} =
        await getCompaniesData({
          companies,
          modules,
          condition,
          countRequired: pageSize - Object.entries(finalData).length,
        });
      finalData = {...finalData, ...itrData};
      indexReached = startIndex + indexReachedVal;
      startIndex += pageIncrements * pageSize;
      console.log(
        "inc++",
        startIndex,
        Object.keys(finalData),
        Object.keys(finalData).length,
        pageSize,
        indexReachedVal
      );
      if (indexReachedVal === -1) {
        break;
      }
    }
    return {data: finalData, indexReached};
  } catch (e) {
    console.log("e2", e);
  }
};

module.exports = {getCompaniesMeetingCondition, getCompaniesData};
const hasNextPage = (marketCap) => {
  return marketCap
    ? allCompanies.slice(endIndex).some((company) => {
        let result = false;
        yahooFinance.quote(
          {
            symbols: company,
            modules: ["price"],
          },
          function (err, quote) {
            if (quote.marketCap > marketCap * 1000000000) {
              result = true;
            }
          }
        );
        return result;
      })
    : true;
};
