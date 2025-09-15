import {createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

import CadastroGerencial from '@/views/Gerencial/cadastroGerencial.vue';
import GerenciaPedidos from '@/views/Gerencial/pedidosGerencial.vue';

import vendidosLacosteView from '@/views/Lacoste/VendidoslacosteView.vue'
import CadastroLacosteView from '@/views/Lacoste/CadastrolacosteView.vue'
import vestuarioLacosteView from '@/views/Lacoste/vestuarioLacosteView.vue' 
import calcadoslacosteView from '@/views/Lacoste/Novidades/calcadoslacosteView.vue'
import acessorioslacosteView from '@/views/Lacoste/Novidades/AcessorioslacosteView.vue'  
import produtoLacosteView from '@/views/Lacoste/produtoLacosteView.vue'
import carrinhoEcommerce from '@/views/Administrador/carrinhoEcommerce.vue'
//Lacoste

import bonesChapeuslacosteView from '@/views/Lacoste/Acessorios/bones&chapeuslacosteView.vue'
import mochilasBolsaslacosteView from '@/views/Lacoste/Acessorios/mochilas&bolsaslacosteView.vue'


import polosLacosteView from '@/views/Lacoste/Vestuario/polosLacosteView.vue'
import camisetaslacosteView from '@/views/Lacoste/Vestuario/camisetaslacosteView.vue'
import suetersMoletomlacosteView from '@/views/Lacoste/Vestuario/sueters&moletomlacosteView.vue'
import tracksuitelacosteView from '@/views/Lacoste/Vestuario/tracksuitelacosteView.vue'
import calcasBermudaslacosteView from '@/views/Lacoste/Vestuario/calcas&bermudaslacosteView.vue'
import cuecaslacosteView from '@/views/Lacoste/Vestuario/cuecaslacosteView.vue'

import chinelolacosteViewVue from '@/views/Lacoste/Calcados/chinelolacosteView.vue.vue'
import tenisLacosteView from '@/views/Lacoste/Calcados/tenislacosteView.vue.vue'


import HomeHugo from '@/views/Hugo/HomeHugoView.vue'
import CatalogoHugoView from '@/views/Hugo/CatalogoHugoView.vue'   
import CadastroHugoView from '@/views/Hugo/CadastroHugoView.vue'

import bonesChapeusHugoView from '@/views/Hugo/Acessorios/bones&chapeusHugoView.vue'
import todosAcessoriosHugoView from '@/views/Hugo/Acessorios/todosAcessoriosHugoView.vue'

import camisetasHugoView from '@/views/Hugo/Roupas/camisetas&regatasHugoView.vue'
import moletonsHugoView from '@/views/Hugo/Roupas/moletonsHugoView.vue'
import poloHugoView from '@/views/Hugo/Roupas/polosHugoView.vue'
import shortsBermudasHugoView from '@/views/Hugo/Roupas/shorts&bermudasHugoView.vue'
import todasRoupasHugoView from '@/views/Hugo/Roupas/todasRoupasHugoView.vue'

import chinelosSlippersHugoView from '@/views/Hugo/Calcados/chinelos&slippersHugoView.vue'
import todosCalçadosHugoView from '@/views/Hugo/Calcados/todosCalçadosView.vue'


const routes = [
//Lacoste 
{   
    path: '/lacoste/cadastro',
    component: CadastroLacosteView
    
},

{   
    path: '/lacoste/vendidos',
    component: vendidosLacosteView
},

{   
    path: '/lacoste/vestuario',
    component: vestuarioLacosteView
},
{   
    path: '/lacoste/acessorios21',
    component: acessorioslacosteView
},
{   
    path: '/lacoste/calcados',
    component: calcadoslacosteView
},

{
    path: '/lacoste/acessorios/bones&chapeus',
    component: bonesChapeuslacosteView
},
{
    path: '/lacoste/acessorios/mochilas&bolsas',
    component: mochilasBolsaslacosteView
},

{
    path: '/lacoste/vestuario/polos',
    component: polosLacosteView
},
{
    path: '/lacoste/vestuario/camisetas',
    component: camisetaslacosteView 
},
{
    path: '/lacoste/vestuario/sueters&moletom',
    component: suetersMoletomlacosteView
},
{   
    path: '/lacoste/vestuario/calcas&bermudas',
    component: calcasBermudaslacosteView
},
{
    path: '/lacoste/vestuario/cuecas',
    component: cuecaslacosteView
},
{
    path: '/lacoste/vestuario/tracksuite',
    component: tracksuitelacosteView
},

{
    path: '/lacoste/vestuario2/',
    component: chinelolacosteViewVue
},
{
    path: '/lacoste/vestuario3',
    component: tenisLacosteView
},

{
    path: '/produto/:slug',
    component: produtoLacosteView
},


//lacoste/Vestuario
{
    path: '/lacoste/acessorios/',
    component: bonesChapeuslacosteView
},
{
    path: '/lacoste/acessorios/',
    component: mochilasBolsaslacosteView
},

//Hugo

{
    path: '/hugo/home',
    component: HomeHugo
},
{
    path: '/hugo/cadastros',
    component: CadastroHugoView
},
{
    path: '/hugo/catalogo',
    component: CatalogoHugoView
},

{
    path: '/hugo/chinelos&slippers',
    component: chinelosSlippersHugoView
},
{
    path: '/hugo/calcados',
    component: todosCalçadosHugoView
},

{
    path: '/hugo/bones&chapeus',
    component: bonesChapeusHugoView
},
{
    path: '/hugo/acessorios',
    component: todosAcessoriosHugoView
},

{
    path: '/hugo/vestuario',
    component: todasRoupasHugoView
},
{
    path: '/hugo/camisetas&regatas',
    component: camisetasHugoView
},
{
    path: '/hugo/moletons',
    component: moletonsHugoView
},
{
    path: '/hugo/polos',
    component: poloHugoView
},
{
    path: '/hugo/shorts&bermudas',
    component: shortsBermudasHugoView
},
{
    path:'/carrinho/checkout',
    component: carrinhoEcommerce,
    
},
{
    path:'/checkout',
    component: () => import('@/views/Administrador/checkoutEcommerce.vue')
},
{
  path: '/login',
  component: () => import('@/views/Administrador/loginEcommerce.vue')
},
{
  path: '/cadastro',
  component: () => import('@/views/Administrador/cadastroEcommerce.vue')
},

{
    path: '/perfilCliente',
    component:() => import('@/views/Administrador/perfilCliente.vue')
},
{
    path: '/pedidosCliente',
    component:() => import('@/views/Administrador/pedidosCliente.vue')
},
{
    path: '/entregaCliente',
    component:() => import('@/views/Administrador/entregaCliente.vue')
},
{
    path: '/consultarEncomenda',
    component:() => import('@/views/Administrador/consultarEncomenda.vue')
},
{  
    path: '/freteSimulador',
    component:() => import('@/views/Administrador/freteSimulador.vue')
},
{  
    path: '/cotacaoFrete',
    component:() => import('@/views/Administrador/cotacaoFrete.vue')
},
 {
    path: '/cadastro-gerencial',
    name: 'CadastroGerencial',
    component: CadastroGerencial,
    meta: { role: 'admin' } // apenas admins
  },
  {
    path: '/gestaoPedidos',
    name: 'GerenciaPedidos',
    component: GerenciaPedidos,
    meta: {  role: 'gerente' } // apenas gerente/admin
  },
  {
    path: '/editDestaques',

    component:() => import('@/views/Gerencial/editDestaques.vue')
  },
  {
    path: '/editCategorias',

    component:() => import('@/views/Gerencial/editCategorias.vue')
  },
   {
    path: '/editPromocoes',

    component:() => import('@/views/Gerencial/editPromocoes.vue')
  },
{
    path: '/',
    component:() => import('@/views/Gerencial/loginGerencial.vue')
},
{
    path: '/estoqueGerencial',
    component:() => import('@/views/Gerencial/estoqueGerencial.vue')
},
{
    path: '/gestaoNovidades',
    component:() => import('@/views/Gerencial/editNovidades.vue')
},
{
    path: '/gestaoExpedicao',
    component:() => import('@/views/Gerencial/entregaGerencial.vue')
},
{
    path: '/gestaoUsuarios',
    component:() => import('@/views/Gerencial/gestaoUsuarios.vue')
},
{
    path: '/cadastroProdutos',
    component:() => import('@/views/Gerencial/cadastroProdutos.vue')
},
{
    path: '/perfilCliente',
    component:() => import('@/views/Administrador/perfilCliente.vue')
},
{
    path: '/cepSearch',
    component:() => import('@/views/cepSearch.vue')
}

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // Garante que o token do localStorage está carregado na store
  if (!auth.token) auth.carregarTokenLocal();

  // Se a rota precisa de autenticação
  if (to.meta.requiresAuth) {
    if (!auth.token) {
      // redireciona para login se não estiver logado
      return next('/login');
    }

    // Se a rota exige uma role específica
    if (to.meta.role) {
      // permite se a role do usuário bater ou se for admin
      if (auth.usuario.role !== to.meta.role && auth.usuario.role !== 'admin') {
        return next('/'); // redireciona para home se não tiver permissão
      }
    }
  }

  // segue normalmente
  next();
});

export default router