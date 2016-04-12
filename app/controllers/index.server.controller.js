module.exports.render = function (req, res) {
  res.render('index', { 
    title: "Hello MEAN!", 
    user: JSON.stringify(req.user)
  });
};