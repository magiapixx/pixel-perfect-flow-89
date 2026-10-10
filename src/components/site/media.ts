import appStore from '@/assets/app-store.jpg'
import phones from '@/assets/phones.jpg'
import laptop from '@/assets/laptop.jpg'
import team from '@/assets/team.jpg'
export { appStore, phones, laptop, team }
export type Project = { name: string; description: string; image: string; tags: string[]; style: string }
export const projects: Project[] = [
 { name:'Stark', description:'A bold new perspective on personal finance.', image:phones, tags:['Digital product','Branding'], style:'' },
 { name:'Clio', description:'Making everyday moments extraordinary.', image:laptop, tags:['UI/UX','Website'], style:'sage' },
 { name:'Vantara', description:'A digital world inspired by nature.', image:laptop, tags:['Branding','Web design'], style:'wide sage' },
 { name:'Clio', description:'A considered experience, from the first touch.', image:appStore, tags:['Digital product'], style:'' },
 { name:'Stark', description:'Clarity in a world of complexity.', image:phones, tags:['Strategy','UI/UX'], style:'' },
]
export const capabilities = [
 {name:'Branding', copy:'Distinct identities that connect with people and move brands forward.', tags:['Brand Strategy','Brand Architecture','Visual Identity','Art Direction','Brand Guidelines']},
 {name:'Digital Products',copy:'Intuitive, meaningful digital experiences built around people.',tags:['Consumer Experiences','User Research & Testing','UX / UI Design','Prototyping','Design Systems']},
 {name:'Websites',copy:'Websites with a point of view. Created to inspire and convert.',tags:['Content Strategy','Web Design','Interactive Experiences','Web Development','CMS Implementation']},
 {name:'Content & 3D',copy:'Fresh perspectives brought to life through story and motion.',tags:['Art Direction','3D Modeling','Motion Design','Photography','Animation']},
 {name:'Development',copy:'Thoughtful engineering for robust, scalable digital products.',tags:['Technology Consulting','Frontend Engineering','Mobile Development','Creative Development','Quality Assurance']},
]
