import { Container } from "../../components/container";
import { PainelHeader } from "../../components/painelHeader";

import {FiTrash2} from 'react-icons/fi'

import { useState, useEffect,useContext } from "react";
import { AuthContext } from '../../contexts/authContext'

import {
    collection,
    getDocs,
    where,
    query,
    doc,
    deleteDoc
} from 'firebase/firestore'
import {ref,deleteObject} from 'firebase/storage'
import {db,storage} from '../../services/firebaseConnection'



interface CarProps{
    id:string;
    name:string;
    year:string;
    price:string | number;
    km:string;
    city:string;
    images:CarImagesProps[]
    uid:string
}

interface CarImagesProps{
    uid:string;
    name:string;
    url:string;
}

export function DashBoard(){
    const {user} = useContext(AuthContext)

    const [cars,setCars] = useState<CarProps[]>([])
    const [loadImages,setLoadImages] = useState<string[]>([]);


    async function handleDeleteCar(car:CarProps){
        const itemCar = car;

        const docRef = doc(db, 'cars' , itemCar.id)
        await deleteDoc(docRef)

        itemCar.images.map( async (image) => {
            const imagPath = `/images/${image.uid}/${image.name}`
            const imageRef = ref(storage, imagPath)

            try{
                await deleteObject(imageRef)

                setCars(cars.filter(car => car.id !== itemCar.id))

            }catch(error){
                console.log(error)
            } 
            
        })
        
    }

    useEffect(() => {
        function  loadCars(){
           
           if(!user?.uid){
                return
           }
           
            const carsRef = collection(db,'cars')
            const queryRef = query(carsRef, where('uid' , '==' , user.uid))

            getDocs(queryRef)
            .then((snapshot) => {
                let listCars = [] as CarProps[];

                snapshot.forEach( doc => {
                    listCars.push({
                        id: doc.id,
                        name: doc.data().name,
                        year: doc.data().year,
                        km: doc.data().km,
                        city: doc.data().city,
                        price: doc.data().price,
                        images: doc.data().images,
                        uid: doc.data().uid
                    })
                })

                setCars(listCars);

            })
        }
        loadCars()

    } , [user])
    
    return(
        <Container>
            <PainelHeader/>


            <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-20">
                   {
                    cars.map(car => (
                        <section 
                        key={car.id}
                        className="w-full bg-white rounded-lg relative">
                        <button 
                        onClick={() => handleDeleteCar(car)}
                        className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow-sm">
                            <FiTrash2 size={26} color="'000"/>
                        </button>
                        <img 
                        className="w-full rounded-lg mb-2 max-h-70"
                        src={car.images[0].url} alt={car.name}
                         />
                        
                        <p
                        className="font-bold mt-1 px-2 mb-2"
                        >{car.name}</p>

                        <div
                        className="flex flex-col px-2"
                        >
                            <span
                            className="text-zinc-700"
                            >Ano {car.year} | {car.km} KM</span>

                            <strong
                            className="text-black font-bold mt-4"
                            >{Number(car.price).toLocaleString('pt-BR' , {
                                style:'currency',
                                currency: 'BRL'
                            })}</strong>
                        </div>

                        <div  className="w-ful h-px bg-slate-200 my-2"></div>

                            <div className="px-2 pb-2">
                                <span className="text-black">{car.city}</span>
                            </div>
                    </section>
                    ))
                   }
            </main>
        </Container>
    )
}