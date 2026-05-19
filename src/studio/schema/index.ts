import category from './documents/category';
import page from './documents/page';
import person from './documents/person';
import post from './documents/post';
import product from './documents/product';
import registration from './documents/registration';
import blockContent from './objects/blockContent';
import button from './objects/button';
import link from './objects/link';
import menuItem from './objects/menuItem';
import card from './objects/sections/card';
import cardGrid from './objects/sections/cardGrid';
import classSchedule from './objects/sections/classSchedule';
import cta from './objects/sections/cta';
import registrationForm from './objects/sections/registrationForm';
import divider from './objects/sections/divider';
import hero from './objects/sections/hero';
import mediaText from './objects/sections/mediaText';
import postList from './objects/sections/postList';
import registrationCta from './objects/sections/registrationCta';
import subscribe from './objects/sections/subscribe';
import seoTypes from './objects/seo';
import blogPage from './singletons/blogPage';
import homePage from './singletons/homePage';
import settings from './singletons/settings';

export const schemaTypes = [
  // Singletons
  settings,
  homePage,
  blogPage,

  // Documents
  page,
  post,
  person,
  category,
  product,
  registration,

  // Sections
  classSchedule,
  cta,
  registrationForm,
  hero,
  mediaText,
  postList,
  registrationCta,
  card,
  cardGrid,
  divider,
  subscribe,

  // Objects
  blockContent,
  link,
  button,
  menuItem,
  ...seoTypes,
];
