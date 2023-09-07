var express = require("express");
var router = express.Router();
var fetch = require("../fetch");

var { GRAPH_ME_ENDPOINT } = require("../authConfig");
function isAuthenticated(req, res, next) {
  if (!req.session.isAuthenticated) {
      return res.redirect("/auth/signin"); // redirect to sign-in route
  }

  next();
}

router.get(
    "/events",
    isAuthenticated, // check if user is authenticated
    async function (req, res, next) {
        try {
            console.log(req.session.accessToken);
            const graphResponse = await fetch(
                GRAPH_ME_ENDPOINT + "/events",
                req.session.accessToken
            );
            console.log(graphResponse);
            res.send({ profile: graphResponse });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
);

module.exports = router;
