
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session')
const connection = require('./databases/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./user/UserController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const Users = require('./user/User')

// ejs
app.set('view engine', 'ejs');

// session
app.use(session({
    secret: 'A4fAdg4$6gsvVB5', // string de segurança, tipo o salt do hash
    cookie: { maxAge: 350000000 /* tempo até a sessão expirar (ms)*/ }
    // 1000 * 60 -> 1min * 60 -> 1h * 24 -> 1d
}))

// teste de session:
// app.get('/session', (req, res) => {
//     //req.session.parametro = ''
//     req.session.usuario = {
//         nickname: '@Fuckner',
//         email: 'felipefclariano04@gmail.com',
//         senha: '1234',
//         idade: 19,
//         linguagens: ['javascript', 'python', 'html', 'css']
//     }
//     res.redirect('/leitura')
// })

// app.get('/leitura', (req, res) => {
//     res.json({session: req.session})
// })

//static
app.use(express.static('public'));

// body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database
connection
    .authenticate()
    .then(() => console.log('Conexão feita com sucesso!'))
    .catch(error => console.log('Houve um problema durante a conexão com o datavase: ' + error));

// rotas
//    prefixo     controller
app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController)

app.get('/', (req, res) => {
    Article.findAll({
        limit: 4,
        order: [
            ['id', 'DESC']
        ]
    })
        .then((articles) => {
            Category.findAll()
                .then((categories) => {
                    res.render('pages/index', { articles, categories })
                })
        })
});

// conf servidor
app.listen(80, error => {
    if (error) {
        console.log('Não foi possivel iniciar o servidor!');
    } else {
        console.log('Servidor rodando!');
    };
});