import { defineArrayMember, defineField } from 'sanity';
import cardGrid from '../objects/sections/cardGrid';
import classList from '../objects/sections/classList';
import classSchedule from '../objects/sections/classSchedule';
import contactForm from '../objects/sections/contactForm';
import cta from '../objects/sections/cta';
import divider from '../objects/sections/divider';
import downloadList from '../objects/sections/downloadList';
import hero from '../objects/sections/hero';
import mediaText from '../objects/sections/mediaText';
import postList from '../objects/sections/postList';
import registrationCta from '../objects/sections/registrationCta';
import registrationForm from '../objects/sections/registrationForm';
import subscribe from '../objects/sections/subscribe';
import team from '../objects/sections/team';

const pageSectionsObjects = [
  cardGrid,
  classList,
  classSchedule,
  contactForm,
  cta,
  divider,
  downloadList,
  hero,
  mediaText,
  postList,
  registrationCta,
  registrationForm,
  subscribe,
  team,
];

export default defineField({
  name: 'pageSections',
  title: 'Page Sections',
  type: 'array',
  of: pageSectionsObjects.map(({ name }) => defineArrayMember({ type: name })),
  group: 'content',
});
