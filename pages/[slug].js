import Layout from '@/components/layout'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Carousel from '@/components/carousel'
import { fade } from "@/helpers/transitions"
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { NextSeo } from 'next-seo'
import SanityPageService from '@/services/sanityPageService'
import Div100vh from 'react-div-100vh'
import ConditionalWrap from 'conditional-wrap';
import FancyLink from '@/components/fancyLink';
import Image from 'next/image'
import login from '@/public/images/login.webp'
import { useSession } from "next-auth/client";

const query = `*[_type == "client" && slug.current == $slug][0]{
	title,
  collections[]{
    enquireEmailAddress,
    imagesGoogleDrive,
    lookbookPdf {
      asset->{
        ...
      },
    },
    collectionImages[]{
      asset->{
        ...
      },
    },
    title
  }
}`

const pageService = new SanityPageService(query)

export default function ClientSlug(initialData) {
  const [session, loading] = useSession();
  
  const { data: { title, collections }  } = pageService.getPreviewHook(initialData)()

  if (loading) {
    return (
      <Div100vh>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full text-center">
            <p className="text-sm">Loading...</p>
          </div>
        </div>
      </Div100vh>
    );
  }

  return (
    <Layout>
      <NextSeo
        title={`${title.toUpperCase()} | | L52 COMMUNICATIONS`}
        openGraph={{
          url: 'https://l52.vercel.app',
          title: `${title.toUpperCase()} | L52 COMMUNICATIONS`,
          images: [
            {
              url: 'https://l52.vercel.app/static/social.jpeg',
              width: 1200,
              height: 630,
              alt: 'L52 Logo',
            },
          ],
          site_name: 'L52',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />

      {!session && (
        <Div100vh>
          <div className="w-full h-full flex items-center justify-center relative">

            <div className="absolute inset-0 z-0">
              <Image
                src={login}
                alt="L52 Login Splash"
                layout="fill"
                className="w-full object-cover object-center mix-blend-overlay"
                priority
              />
            </div>

            <span className="absolute top-0 left-0 uppercase text-xs text-[20px] md:text-[42px] xl:text-[64px] mt-[50px] md:mt-[75px] font-light ml-[35px] md:ml-[50px] text-white">
              L52
            </span>

            <span className="absolute top-0 right-0 uppercase text-xs text-[20px] md:text-[42px] xl:text-[64px] mt-[50px] md:mt-[75px] font-light mr-[35px] md:mr-[50px] text-right text-white">
              Communications
            </span>

            <span className="absolute bottom-0 left-0 uppercase text-xs text-[20px] md:text-[42px] xl:text-[64px] mb-[50px] md:mb-[75px] font-light ml-[35px] md:ml-[50px] text-white">
              Digital
            </span>

            <span className="absolute bottom-0 right-0 uppercase text-xs text-[20px] md:text-[42px] xl:text-[64px] mb-[50px] md:mb-[75px] font-light mr-[35px] md:mr-[50px] text-right text-white">
              Showroom
            </span>

            <div className="w-full text-center text-white relative z-10">

              <a href={'/auth/signin'} className="text-white px-5 md:px-6 py-3 md:py-4 uppercase border md:text-lg border-[#f7ff00] hover:border-white focus:border-white transition ease-in-out duration-300">Sign in</a>
            </div>
          </div>
        </Div100vh>
      )}
      
      {session && (
        <LazyMotion features={domAnimation}>
          <ConditionalWrap
            condition={!!collections?.length > 1}
            wrap={children => (
              <Div100vh>
                {children}
              </Div100vh>
            )}
          >  
            <m.div
              initial="initial"
              animate="enter"
              exit="exit"
              className={`${collections?.length > 1 ? '' : 'flex flex-col h-full' }`}
            >
              
              <Header />

              <m.div variants={fade} className="px-[25px] md:px-[35px] 2xl:px-[65px] w-full">
                <h1 className="uppercase text-[28px] md:text-[32px] leading-none mt-[1.5rem] mb-[0.5rem]">{title}</h1>
              </m.div>


              {collections?.length > 0 ? (
                <>
                  {collections.map((item, i) => {
                    return (
                      <div key={i}>
                        <m.div variants={fade} div className="w-full flex flex-wrap items-start md:items-center px-[25px] md:px-[35px] 2xl:px-[65px] mb-[1rem]">
                          <div className="w-auto">
                            <span className="block uppercase text-xs md:text-sm text-blue">{item.title}</span>
                          </div>
                          <div className="ml-auto hidden md:block">
                            <div className="md:flex md:items-center text-right">
                              { item.enquireEmailAddress && (
                                <div className="md:ml-6">
                                  <FancyLink fast destination={`mailto:${item.enquireEmailAddress}`} label="Enquire" />
                                </div>
                              )}
                              { item.imagesGoogleDrive && (
                                <div className="md:ml-6">
                                  <FancyLink destination={item.imagesGoogleDrive} label="Download Images" />
                                </div>
                              )}
                              { item.lookbookPdf && (
                                <div className="md:ml-6">
                                  <FancyLink destination={item.lookbookPdf.asset.url} label="Download Lookbook" />
                                </div>
                              )}
                            </div>
                          </div>
                        </m.div>
            
                        <m.div variants={fade} className={`w-full ${collections.length > 0 ? 'h-[70vh]' : '' }`}>
                          <div className="w-full h-full flex items-center">
                            <div className="w-full h-full">
                              <Carousel slides={item.collectionImages} />
                            </div>
                          </div>
                        </m.div>
                      </div> 
                    )
                  })}
                </>
              ) : (
                <m.span variants={fade} className="block px-[25px] md:px-[35px] 2xl:px-[65px] text-sm opacity-75">Collection Coming Soon</m.span>
              )}
              

              <m.div variants={fade} className="w-full">
                <Footer />
              </m.div>
            </m.div>
          </ConditionalWrap>
        </LazyMotion>
      )}
    </Layout>
  )
}

export async function getStaticProps(context) {
  const props = await pageService.fetchQuery(context)
  return {
    props
  };
}

export async function getStaticPaths() {
  const paths = await pageService.fetchPaths('client')
  return {
    paths: paths,
    fallback: true,
  };
}