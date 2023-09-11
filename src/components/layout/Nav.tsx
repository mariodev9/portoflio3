import React, { useEffect, useRef, useState } from 'react'
import { PrimaryBox } from '../common/PrimaryBox'
import { GithubIcon, LinkedinIcon, MenuIcon } from '../icons'
import { AnimatePresence, useCycle, useMotionValueEvent, useScroll } from 'framer-motion'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

// OBJETO LINK DE NAVEGACION
interface navItem {
  name: string
  url: string
}

const navLinks:navItem[] = [
  {
    name: "Sobre mí",
    url: "/#section_about"
  },
  {
    name: "Experiencia",
    url: "/#section_experience"
  },
  {
    name: "Proyectos",
    url: "/#section_proyects"
  },
  {
    name: "Habilidades",
    url: "/#section_skills"
  },
  {
    name: "Contacto",
    url: "/#section_contact"
  },
]

// -----------------------------


// BARRA DE NAVEGACION MOBILE - MOTION VARIANTS
const itemVariants = {
  closed: {
    opacity: 0,
  },
  open: { opacity: 1 }
};

const sideVariants = {
  closed: {
    transition: {
      staggerChildren: 0,
      staggerDirection: 0
    }
  },
  open: {
    transition: {
      staggerChildren: 0.2,
      staggerDirection: 1
    }
  }
};
// -----------------------


const DesktopNavbar = () => (
  <div className='hidden md:flex justify-between items-center  px-5'>
      <a href='/#section_header' className='font-semibold text-2xl'>Mario.dev</a>
    <ol className='flex gap-5 items-center'>
      {navLinks.slice(0,4).map( item=> (
        <a key={item.name} className='hover:text-primary transition-all' href={item.url}>{item.name}</a>
      ))}
      <a href='mailto:luciano.mariotti99@gmail.com'>
        <PrimaryBox size='lg' text={"Contactar"}/>
      </a>
    </ol>
  </div>
)

const MobileNavbar = () => {

  const router = useRouter()

  function handleSubmit(url:string) {
    router.push(url)
    cycleOpen()
  }

  const [open, cycleOpen] = useCycle(false, true);

  return (
  <>
  <div className='flex md:hidden justify-between items-center '>
    <div className='font-semibold '>Mario.dev</div>
    <div className='cursor-pointer' onClick={() => cycleOpen()}><MenuIcon/></div>
  </div>

  <AnimatePresence>
        {open && (
          <motion.aside
            className='overflow-x-hidden pl-5 bg-dark fixed z-50 h-screen top-0 left-0 w-full'
            initial={{ width: 0 }}
            animate={{
              width: 330
            }}
            exit={{
              width: 0,
              transition: { delay: 0.3, duration: 0.3 }
            }}
          >
            <div className='flex justify-end my-5 pr-5'>
              <motion.button exit={{opacity: 0}} className='' onClick={() => cycleOpen()}> Cerrar</motion.button>
            </div>
            <motion.div
                className="flex flex-col h-3/4 gap-5 bg-dark justify-center cursor-pointer"
                initial="closed"
                animate="open"
                exit="closed"
                variants={sideVariants}
              >
                <ol className='flex flex-col gap-5 items-center text-3xl font-medium'>
                  {navLinks.map( navItem => (
                    <motion.li key={navItem.name} onClick={() => handleSubmit(navItem.url)} variants={itemVariants}>{navItem.name}</motion.li>
                  ) )}
                </ol>
                <motion.div variants={itemVariants} className='flex mt-5 gap-5 justify-center'>
                  <a href='https://github.com/mariodev9/'>                    
                    <GithubIcon/>                  
                  </a>
                  <a href='https://www.linkedin.com/in/luciano-mariotti/'>                    
                    <LinkedinIcon/>
                  </a>
                </motion.div>
            </motion.div>
          </motion.aside>
        )}
    </AnimatePresence>
  </>
  )
}

const variants = {
  visible: { 
    opacity: 1,     
    transition: {
      duration: 0.3,
    },
  },
  hidden: { 
    opacity: 0 
  },
  
};


export default function Nav() {
  
  // Valores del scroll
  const { scrollY } = useScroll();
  const prevScrollY = useRef(0);

  // Estado de la barra de navegacion
  const [hidden, setHidden] = useState(false);

  // Utiliza el valor del scroll para esconder la barra de navegacion 
  // cuando se scrollea para abajo
  useEffect(() => {
    const handleScroll = () => {
      // Valores del scroll
      const currentScrollY = scrollY.get();
      const prevScrollValue = prevScrollY.current;
            
      if (currentScrollY > prevScrollValue) {
        setHidden(true)
      }else {
        setHidden(false)
      }

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.div
      variants={variants}
      animate={hidden ? "hidden" : "visible"}
      className='fixed bg-dark w-full z-50 px-5 py-5 md:py-2'
    >
      <DesktopNavbar/>
      <MobileNavbar/>
    </motion.div>
  )
}
