import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BlogView from '@/views/BlogView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import VerifyOtpView from '@/views/Auth/VerifyOtpView.vue'
import AuthorBlogsView from '@/views/Author/BlogsView.vue'
import AuthorCreateView from '@/views/Author/CreateView.vue'
import AuthorEditView from '@/views/Author/EditView.vue'
import AuthorBlogView from '@/views/Author/BlogView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        title: 'Login',
        guestOnly: true,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        title: 'Register',
        guestOnly: true,
      },
    },
    {
      path: '/verify-otp',
      name: 'verify-otp',
      component: VerifyOtpView,
      meta: {
        title: 'Verify OTP',
        guestOnly: true,
      },
    },
    {
      path: '/blogs/:id',
      name: 'blog',
      component: BlogView,
      meta: {
        title: 'Blog View',
      },
    },
    {
      path: '/author/blogs',
      name: 'author-blog',
      component: AuthorBlogsView,
      meta: {
        title: 'Author Blogs',
        requiresAuth: true,
      },
    },
    {
      path: '/author/blogs/:id',
      name: 'author-blog-view',
      component: AuthorBlogView,
      meta: {
        title: 'Author Blogs View',
        requiresAuth: true,
      },
    },
    {
      path: '/author/blogs/create',
      name: 'author-blog-create',
      component: AuthorCreateView,
      meta: {
        title: 'Author Blogs Create',
        requiresAuth: true,
      },
    },
    {
      path: '/author/blogs/:id/edit',
      name: 'author-blog-edit',
      component: AuthorEditView,
      meta: {
        title: 'Author Blogs Edit',
        requiresAuth: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: {
        title: 'Page Not Found',
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const isLoggedIn = auth.token !== null

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }

  if (to.meta.guestOnly && isLoggedIn) {
    return next('/author/blogs')
  }

  if (to.meta?.title) {
    document.title = `${to.meta.title} | Blog Applciation`
  }

  return next()
})

export default router
