const Post = {
    // resolver pre objekt author - pokial neni SCALAR type treba set-upnut takyto resolver
    // keby nebol tak pusti resolver pre posts : () => ktory vracia posty ale bez authorov
    // tento resolver ju overridne a pomocou parent zoberie posts + author resolver pre authora
    // metoda sa bude iterovat pre kazdy post ku ktoremu prida prislusneho autora
    // author: (parent, args, { data }, info) => {
    //     // parent.author
    //     return data.users.find((user) => {
    //         return user.id === parent.author;
    //     });
    // },
    // comments: (parent, args, { data }, info) => {
    //     return data.comments.filter((comment) => {
    //         // comment post je Post ID a parent.id je tiez Post ID lebo comment parti Post cize je jeho parent
    //         return comment.post === parent.id;
    //     });
    // }
}

export { Post as default }