const router = require("express").Router();
const apiRoutes = require("./api");
const authRoutes = require("./auth");


// API Routes
router.use("/api", apiRoutes);

//Auth Routes
router.use("/auth", authRoutes);

//check for login
const authCheck = (req, res, next) => {
    if (!req.user){
        res.status(401).json({
            authenticated: false,
            message: "user not authenticated"
        });
    }else{
        next();
    }
};

//if already logged in, send profile
router.get("/", authCheck, (req, res) => {
    res.status(200).json({
        authenticated:true,
        message:"user successfully authenticated",
        user:req.user,
        cookies:req.cookies
    });
});

router.get("/readsessions", (req,res)=>{
    // res.json(req.session);
    res.json(req.user)
});

module.exports = router;