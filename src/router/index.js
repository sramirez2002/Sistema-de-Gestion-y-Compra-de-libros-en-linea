import Vue from 'vue'
import VueRouter from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ChangePassword from '@/views/ChangePassword.vue'
import AdministratorRegisterView from '@/views/AdministratorRegisterView.vue'
import RootView from '@/views/RootView.vue'
import SendConfirmationView from '@/views/SendConfirmationView.vue'
import AddBookView from '@/views/AddBookView.vue'
import EditBookView from '@/views/EditBookView.vue'
import RecentBooksView from '@/views/Recents.vue'
import SearchBookView from '@/views/SearchBookView.vue'
import CreditCardView from '@/views/CreditCardView.vue'
import PaymentMethodsView from '@/views/PaymentMethodsView.vue'
import PageNoFound from '@/views/PageNoFound.vue'
import HistoricalBooksView from '@/views/Historical.vue'
import Book from '@/views/BookPage.vue'
import AdminEdit from '@/views/AdministratorEditView.vue'
import ClienteEdit from '@/views/ClienteEditView.vue'
import Chats from '@/views/Chats.vue'
import MessagesView from '@/views/MessageView.vue'
import MapsView from '@/views/MapsView.vue'
import CarritoView from '@/views/CarritoView.vue'
import PagarView from '@/views/PagarView.vue'
import HistoryView from '@/views/HistoryView.vue'
import DetailsView from '@/views/DetailsView.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  //ruta para error 404
  {
    path: '/',
    name: 'recents',
    component: RecentBooksView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: AboutView
  },
  {
    path: '/about',
    redirect: '/login', // Redirige /about a /login
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: ChangePassword
  },
  {
    path: '/administrator-register',
    name: 'administrator-register',
    component: AdministratorRegisterView
  },
  {
    path: '/root',
    name: 'root',
    component: RootView
  },

  {
    path: '/details',
    name: 'details',
    component: DetailsView
  },

  {
    path: '/send-confirmation',
    name: 'send-confirmation',
    component: SendConfirmationView
  },

  {
    path: '/add-book',
    name: 'add-book',
    component: AddBookView
  },

  {
    path: '/edit-book',
    name: 'edit-book',
    component: EditBookView
  },

  {
    path: '/recents',
    name: 'recents',
    component: RecentBooksView
  },
  {
    path: '/search-book',
    name: 'search-book',
    pathname: 'search-book',
    component: SearchBookView,
  },
  {
    path: '/credit-card',
    pathname: 'credit-card',
    component: CreditCardView
  },
  {
    path: '/payment',
    pathname: 'payment',
    component: PaymentMethodsView
  },
  {
    path: '/historical',
    pathname: 'historical',
    component: HistoricalBooksView
  },
  {
    path: '/Book/:id',
    name: 'Book',
    component: Book
  },
  {
    path: '/admin-edit',
    name: 'admin-edit',
    component: AdminEdit
  },
  {
    path: '/cliente-edit',
    name: 'cliente-edit',
    component: ClienteEdit
  },
  {
    path: '/chats',
    name: 'ChatsView',
    component: Chats
  },
  {
    path: '/messages',
    name: 'MessagesView',
    component: MessagesView
  },
  {
    path: '/maps',
    name: 'MapsView',
    component: MapsView
  },
  {
    path: '/carrito',
    name: 'CarritoView',
    component: CarritoView
  },
  {
    path: '/checkout',
    name: 'PagarView',
    component: PagarView
  },
  {
    path: '/history',
    name: 'HistoryView',
    component: HistoryView
  },
  {
    path: '/:pathMatch(.*)*',//ruta para error 404 debe ser la ultima ruta
    name: '404',
    component: PageNoFound
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
