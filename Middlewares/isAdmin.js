const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
       
        next();
    } else {
        
        res.status(403).json({ message: "Accesso negato. Solo gli admin hanno accesso." });
    }
};

module.exports = isAdmin;