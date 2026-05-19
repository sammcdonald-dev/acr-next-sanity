export const twitterFragment = /* groq */ `
  _type,
  site,
  creator,
  cardType,
  handle,
`;

export const imageFragment = /* groq */ `
  _type,
  crop {
    _type,
    right,
    top,
    left,
    bottom
  },
  hotspot {
    _type,
    x,
    y,
    height,
    width,
  },
  asset->{...},
`;

export const openGraphFragment = /* groq */ `
  _type,
  siteName,
  url,
  description,
  title,
  image {
    ${imageFragment}
  },
`;

export const metaAttributesFragment = /* groq */ `
  _type,
  attributeValueString,
  attributeType,
  attributeKey,
  attributeValueImage {
    ${imageFragment}
  },
`;

export const additionalMetaTagFragment = /* groq */ `
  _key,
  _type,
  metaAttributes[] {
    ${metaAttributesFragment}
  },
`;

export const seoFragment = /* groq */ `
  _type,
  metaTitle,
  noIndex,
  seoKeywords,
  metaDescription,
  metaImage{
    ${imageFragment}
  },
  additionalMetaTags[]{
    ${additionalMetaTagFragment}
  },
  openGraph {
    ${openGraphFragment}
  },
  twitter {
    ${twitterFragment}
  }
`;

export const linkFragment = /* groq */ `
  _type,
  type,
  openInNewTab,
  external,
  href,
  internal->{
    _type,
    _id,
    "slug": slug.current
  },
`;

const customLinkFragment = /* groq */ `
  ...customLink{
    ${linkFragment}
  },
`;

const markDefsFragment = /* groq */ `
  markDefs[]{
    ...,
    ${customLinkFragment}
  },
`;

const contentFragment = /* groq */ `
  content[]{
    ...,
    ${markDefsFragment}
  },
`;

export const buttonFragment = /* groq */ `
  _key,
  _type,
  variant,
  text,
  link {
    ${linkFragment}
  },
`;

export const buttonsFragment = /* groq */ `
  buttons[]{
    ${buttonFragment}
  },
`;

export const heroSectionFragment = /* groq */ `
  _type,
  heading,
  text,
  ${buttonsFragment}
`;

export const mediaTextSectionFragment = /* groq */ `
  _type,
  heading,
  text,
  media,
  mediaPosition,
  ${buttonsFragment}
`;

export const categoryFragment = /* groq */ `
  _id,
  _type,
  title,
  "slug": slug.current,
  description,
`;

export const personFragment = /* groq */ `
  _id,
  _type,
  firstName,
  lastName,
  image,
  role,
  biography,
  "slug": slug.current,
`;

export const postCardFragment = /* groq */ `
  _type,
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  image,
  "categories": categories[]->{${categoryFragment}},
  "date": coalesce(date, _updatedAt),
  "author": author->{${personFragment}},
  "wordCount": count(string::split(coalesce(pt::text(content), ''), " ")),
`;

export const postFragment = /* groq */ `
  ${postCardFragment}
  ${contentFragment}
  seo {
    ${seoFragment}
  },
`;

export const postListSectionFragment = /* groq */ `
    _type,
    heading,
    numberOfPosts,
    "posts": *[_type == 'post'] | order(_createdAt desc, _id desc) [0...20] {
      ${postFragment}
    }
`;

export const dividerSectionFragment = /* groq */ `
  _type,
  height
`;

export const ctaSectionFragment = /* groq */ `
  _type,
  heading,
  text,
  ${buttonsFragment}
`;

export const subscribeSectionFragment = /* groq */ `
  _type,
  heading,
  text
`;

export const cardGridFragment = /* groq */ `
  _type,
  heading,
  ${contentFragment}
  icon,
`;

export const cardGridsSectionFragment = /* groq */ `
  ${cardGridFragment}
  cards[]{
    ${cardGridFragment}
  },
`;

export const registrationCtaSectionFragment = /* groq */ `
  _type,
  eyebrow,
  heading,
  body[]{
    ...,
    ${markDefsFragment}
  },
  ${buttonsFragment}
  note,
  product->{
    _id,
    name,
    "spotsRemaining": select(
      defined(maxSpots) => maxSpots - count(*[_type == "registration" && references(^._id) && status in ["pending", "confirmed"]]),
      null
    )
  },
  "uid": uid.current
`;

export const classScheduleSectionFragment = /* groq */ `
  _type,
  eyebrow,
  heading,
  body[]{
    ...,
    markDefs[]{
      ...,
      ...customLink{
        ${linkFragment}
      },
    },
  },
  classes[]{
    _key,
    title,
    ageGroup,
    day,
    time,
    rate,
    description,
  },
  "uid": uid.current
`;

const productWithSpotsFragment = /* groq */ `
  _id,
  name,
  description,
  stripeMode,
  "spotsRemaining": select(
    defined(maxSpots) => maxSpots - count(*[_type == "registration" && references(^._id) && status in ["pending", "confirmed"]]),
    null
  )
`;

export const registrationFormSectionFragment = /* groq */ `
  _type,
  heading,
  body[]{
    ...,
    ${markDefsFragment}
  },
  submitButtonLabel,
  "products": select(
    defined(products) && count(products) > 0 => products[]->{${productWithSpotsFragment}},
    *[_type == "product"] | order(name asc) {${productWithSpotsFragment}}
  ),
  "uid": uid.current
`;

export const pageBuilderFragment = /* groq */ `
  pageSections[]{
    ...,
    _key,
    _type,
    _type == 'cardGrid' => {${cardGridsSectionFragment}},
    _type == 'classSchedule' => {${classScheduleSectionFragment}},
    _type == 'cta' => {${ctaSectionFragment}},
    _type == 'divider' => {${dividerSectionFragment}},
    _type == 'hero' => {${heroSectionFragment}},
    _type == 'mediaText' => {${mediaTextSectionFragment}},
    _type == 'postList' => {${postListSectionFragment}},
    _type == 'registrationCta' => {${registrationCtaSectionFragment}},
    _type == 'registrationForm' => {${registrationFormSectionFragment}},
    _type == 'subscribe' => {${subscribeSectionFragment}}
  },
`;

export const menuItemFragment = /* groq */ `
  _type,
  _key,
  text,
  type,
  link {
    ${linkFragment}
  },
`;

export const menuFragment = /* groq */ `
  menu[]{
    ${menuItemFragment}
    childMenu[]{
      ${menuItemFragment}
    }
  }
`;

export const pageFragment = /* groq */ `
  ${pageBuilderFragment}
  seo {
    ${seoFragment}
  },
`;
