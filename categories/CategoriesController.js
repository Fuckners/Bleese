const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const Category = require('./Category');
const Article = require('../articles/Article')
const adminAuth = require('../middlewares/adminAuth')

router.get('/categories/:slug', (req, res) => {
    const slug = req.params.slug
    
    Category.findOne({
        where: { slug },
        include: { model: Article }
    })
        .then((category) => {
            Category.findAll()
                .then((categories) => {
                    res.render('pages/category', { category , categories})
                })
        })
})

router.get('/admin/categories/new', adminAuth , (req, res) => {
    res.render('admin/categories/news')
});

router.post('/categories/save', (req, res) => {
    const title = req.body.title;
    if (!title || title.trim() == '') {
        res.redirect('/admin/categories/new')
        console.log('Categoria inválida')
    } else {
        Category.create({
            title,
            slug: slugify(title)
        })
            .then(() => {
                res.redirect('/admin/categories');
            })
            .catch((error) => {
                console.log('Não foi possivel adicionar a categoria no Database!');
        });
    }
});

router.get('/admin/categories', adminAuth , (req, res) => {
    Category.findAll()
        .then((categories) => {
            res.render('admin/categories/index', { categories });
        });
});

router.post('/admin/categories/del', adminAuth , (req, res) => {
    const id = req.body.id
    if (!id || !isNaN(id)) { // não é undefined e é um número
        Category.destroy({
            where: {
                id
            }
        })
            .catch((error) => {
                    console.log('Não foi possivel deletar a categoria');
            });
    }
    res.redirect('/admin/categories');
});

router.get('/admin/categories/edit/:id', adminAuth , (req, res) => {
    const id = req.params.id
    if (isNaN(id)) {
        res.redirect('/admin/categories')
    } else {
        Category.findByPk(id)
            .then((category) => {
                if (category) {
                    res.render('admin/categories/edit', { category })
                } else {
                    console.log('Não foi possível editar a categoria')
                    res.redirect('/admin/categories')
                }
            })
            .catch((error) => {
                res.redirect('/admin/categories')
            });
    }
});

router.post('/categories/update', (req, res) => {
    const id = req.body.id
    const title = req.body.title
    // atualizar o titulo da categoria com o ID do formulário
    Category.update({ title, slug: slugify(title) }, {
        where: {
            id
        }
    })
        .then(() => {
            res.redirect('/admin/categories')
        })
})

module.exports = router;