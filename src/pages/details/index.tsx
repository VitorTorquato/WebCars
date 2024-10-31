import { useEffect,useState } from "react"
import { useParams ,useNavigate} from "react-router-dom"


import {FaWhatsapp} from 'react-icons/fa'

import { Container } from "../../components/container"

import { Swiper,SwiperSlide } from 'swiper/react'

import {
    getDoc,
    doc
    } from 'firebase/firestore'

import { db } from '../../services/firebaseConnection'


interface CarProps{
    id:string;
    name:string;
    model:string;
    city:string;
    year:string;
    km:string;
    description:string;
    createdAt:string;
    price:number | string;
    owner:string;
    uid:string;
    whatsapp:string;
    images:CarImagesProps[];

}


interface CarImagesProps{
    uid:string;
    name:string;
    url:string;
}

export function Details(){

    const [car,setCar] = useState<CarProps>()
    const {id} = useParams();
    const navigate = useNavigate();

    const [sliderPerview , setSliderPerview] = useState<number>(2)

    useEffect(() => {
        async function loadCar(){
            if(!id){return}

            const docRef = doc(db, 'cars' , id)
            getDoc(docRef)
            .then((snapshot) => {

                if(!snapshot.data()){
                    navigate('/')
                }

                setCar({
                    id:snapshot.data()?.id,
                    name: snapshot.data()?.name,
                    model: snapshot.data()?.model,
                    city: snapshot.data()?.city,
                    year: snapshot.data()?.year,
                    km: snapshot.data()?.km,
                    description: snapshot.data()?.description,
                    price: snapshot.data()?.price,
                    createdAt: snapshot.data()?.createdAt,
                    owner: snapshot.data()?.owner,
                    uid: snapshot.data()?.uid,
                    whatsapp: snapshot.data()?.whatsapp,
                    images: snapshot.data()?.images,
                })
            })

        }

        loadCar()

    } , [id])

    //funcao para fazer o resize caso a tela seja menor que 720 eu quero que apareca apenas uma imagem no meu slide
    
useEffect(() => {
    function handleResize(){
        if(window.innerWidth < 720){
            setSliderPerview(1);
        }else{
            setSliderPerview(2);
        }
    }
    handleResize()

    window.addEventListener('resize' , handleResize)

    return ( ) => {
        window.removeEventListener('resize' , handleResize)
    }

} , [])

    return(
        <Container>
              {
                car && (
                    <Swiper
                    slidesPerView={sliderPerview}
                    pagination={{clickable: true}}
                    navigation
    
                    >
                        {
                            car?.images.map(image => (
                                <SwiperSlide key={image.name}>
                                    <img
                                    src={image.url}
                                    alt={image.name}
                                    className="w-full h-96 object-cover"
                                     />
                                </SwiperSlide>
                            ))
    
                        }
    
                    </Swiper>
                )
              }

            {
                car && (
                    <main className="w-full bg-white rounded-lg p-6 my-4">
                        <div
                        className="flex flex-col sm:flex-row mb-4 items-center justify-between"
                        >
                            <h1 
                            className="font-bold text-3xl text-black"
                            >{car?.name}</h1>
                            <h2
                             className="font-bold text-3xl text-black"
                            >{Number(car?.price).toLocaleString('pt-BR' , {
                                style:'currency',
                                currency: 'BRL'
                            })}</h2>

                        </div>

                        <p>{car?.model}</p>

                        <div className="flex w-full gap-6 my-4">
                          
                          <div className="flex flex-col gap-4">
                            <div>
                                <p>Cidade</p>
                                <strong>{car?.city}</strong>
                            </div>

                            <div>
                                <p>Ano</p>
                                <strong>{car?.year}</strong>
                            </div>

                          </div>

                          <div className="flex flex-col gap-4">
                            <div>
                                <p>KM</p>
                                <strong>{car?.km}</strong>
                            </div>

                          </div>

                        </div>
                        
                          <strong>Descricao</strong>
                           <p className="mb-4">{car?.description}</p> 

                           <strong>Telefone/Whatsapp</strong>
                           <p>{car?.whatsapp}</p>

                           <a 
                           href={`https://api.whatsapp.com/send?${car?.whatsapp}&text=Ola vi esse ${car?.name} no site webCarros e fiquei enteressado`}
                           target="_blank"
                           className="bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium cursor-pointer"
                           >
                            Conversar com o vendedor
                            <FaWhatsapp size={26} color="#FFF"/>
                           </a>
                    </main>
                )
            }
        </Container>
    )
}