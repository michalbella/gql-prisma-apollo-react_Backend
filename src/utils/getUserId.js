import jwt from 'jsonwebtoken'

const getUserId = (request, requireAuth = true) => {
    // requireAuth = true - default je potrebna autentifikacia 
    // moze sa default prepisat na false a vtedy nieje treba autentifikaciu a pristup maju aj pouzivatelia bez tokenu

    // * ziskanie auth headeru z HTTP requestu -> request.request.headers.authorization
    // * ziskanie auth headeru z WEBSOCKET-u -> request.connection.context.Authorization

    // ak existuje request.request vrati sa auth pre HTTP v opacnom pripade pre WEBSOCKET
    const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization

    if (header) {
        // pre autorizovanych pouzivatelov, ktori maju token
        const token = header.replace('Bearer ', '') // ziskanie tokenu z request + odstranenie beareru
        const decoded = jwt.verify(token, 'thisisasecret') // rozdekodovanie
        return decoded.userId
    }
    // ak je true - trena autentifikaciu tokenom
    if (requireAuth) {
        throw new Error('Authentification required')
    }
    return null // aby nedavalo ID undefined ale null ked nenajde, kede user nema token kde je ID
}

export { getUserId as default }