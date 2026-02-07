const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://127.0.0.1:27017/moynesam')
  .then(() => console.log('MongoDB подключена'))
  .catch(err => console.log('Ошибка MongoDB:', err));

// Модель пользователя
const UserSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  email: String,
  login: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' }
});
const User = mongoose.model('User', UserSchema);

// Модель заявки
const OrderSchema = new mongoose.Schema({
  userId: String,
  fullName: String,
  phone: String,
  address: String,
  serviceType: String,
  customService: String,
  dateTime: Date,
  paymentType: String,
  status: { type: String, default: 'новая' },
  cancelReason: String
}, { timestamps: true });
const Order = mongoose.model('Order', OrderSchema);

// Регистрация
app.post('/api/register', async (req, res) => {
  try {
    const { login } = req.body;
    if (await User.findOne({ login })) {
      return res.status(400).json({ message: 'Логин занят' });
    }
    const user = new User(req.body);
    await user.save();
    res.json({ message: 'Ok' });
  } catch (e) {
    res.status(400).json({ message: 'Ошибка регистрации' });
  }
});

// Вход
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;

  if (login === 'adminka' && password === 'cleanservic') {
    return res.json({ id: 'admin', fullName: 'Администратор', role: 'admin' });
  }

  const user = await User.findOne({ login, password });
  if (!user) return res.status(401).json({ message: 'Неверные данные' });

  res.json({ id: user._id, fullName: user.fullName, role: 'user' });
});

// Получить заявки
app.get('/api/orders', async (req, res) => {
  const { userId } = req.query;
  const filter = userId === 'admin' ? {} : { userId };
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json(orders);
});

// Создать заявку
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (e) {
    res.status(400).json({ message: 'Ошибка' });
  }
});

// Изм статус
app.patch('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Не найдено' });

    Object.assign(order, req.body);
    await order.save();
    res.json(order);
  } catch (e) {
    res.status(400).json({ message: 'Ошибка' });
  }
});

app.listen(3000, () => {
  console.log('Сервер запущен → http://localhost:3000');
});