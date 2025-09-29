import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET || "HNSHBCSBSBnkcskhcnsndncskcsnksncsnsns"

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token)

    if(!token) {
        return res.status(401).json({ msg: "Acesso Negado", status: false })
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
           return res.status(403).json({ message: 'Token inválido ou expirado.', status: false });
        }
        req.user = decoded
        next()
    })
}