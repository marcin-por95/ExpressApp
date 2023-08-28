const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer = require('multer');


const app = express();

app.engine('.hbs', hbs({
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'main'
}));
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, '/public')));

app.use(express.static(path.join(__dirname, '/user')));


app.use('/user/', (req, res, next) => {
    res.render('forbidden', { layout: false })
});
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['.png', '.jpg', '.jpeg', '.gif'];
    const ext = path.extname(file.originalname);
    if (allowedFileTypes.includes(ext.toLowerCase())) {
        cb(null, true);
    } else {
        req.fileError = 'Only .png, .jpg, .jpeg, or .gif files are allowed.';
        cb(null, false);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ fileFilter });


app.use(express.urlencoded({ extended: false }));


app.use(express.json());

app.get(['/','/home'], (req, res) => {
    res.render('index')
});

app.get('/about', (req, res) => {
    res.render('about', { layout: 'dark'})
});

app.get('/info', (req, res) => {
    res.render('info');
});

app.get('/history', (req, res) => {
    res.render('history');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/hello/:name', (req, res) => {
    res.render('hello', { name: req.params.name });
});


app.post('/contact/send-message', upload.single('file'),  (req, res) => {

    const { author, sender, title, message } = req.body;

    if(author && sender && title && message && req.file) {
        const fileName = req.file && req.file.originalname;


        res.render('contact', { isSent: true, fileName });
    }
    else {

        res.render('contact', { isError: true, fileError: req.fileError  });
    }

});

app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});