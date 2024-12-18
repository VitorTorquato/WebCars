import { Container } from "../../components/container";
import { Link } from "react-router-dom";

import { useState,useEffect } from "react";

import {collection,query,getDocs, orderBy,where} from 'firebase/firestore'
import {db} from '../../services/firebaseConnection'

interface CarsProps{
    id:string;
    name:string;
    year:string;
    uid:string;
    price:string | number;
    city:string;
    km:string
    image:CarImageProps[];
}

interface CarImageProps{
    name:string;
    uid:string;
    url:string;
}

export function Home(){


    const [cars,setCars] = useState<CarsProps[]>([]);
    const [loadImages,setLoadImages] = useState<string[]>([]);
    const [search,setSearch] = useState('')

  

//Para evitar o efeito layout shift
    function handleImageLoad(id:string){
        setLoadImages((prevState) => [...prevState,id])
    }

    function  loadCars(){
        const carsRef = collection(db,'cars')
        const queryRef = query(carsRef, orderBy('createdAt' , 'desc'))

        getDocs(queryRef)
        .then((snapshot) => {
            let listCars = [] as CarsProps[];

            snapshot.forEach( doc => {
                listCars.push({
                    id: doc.id,
                    name: doc.data().name,
                    year: doc.data().year,
                    km: doc.data().km,
                    city: doc.data().city,
                    price: doc.data().price,
                    image: doc.data().images,
                    uid: doc.data().uid
                })
            })

            setCars(listCars);

        })
    }   
    
    
    async function handleSearchCar(){
        if(!search){
            loadCars()
            return;
        }
        setCars([]);
        setLoadImages([])

        const q = query(collection(db, 'cars') ,
         where('name' , '>=', search.toUpperCase()),
         where('name' , '<=' , search.toUpperCase() + '\uf8ff')//um filtro para garatir que a consulta vi incluit todos os caracteres
        )

        const querySnapshot = await getDocs(q)

        let listCars = [] as CarsProps[];

        querySnapshot.forEach(doc => {
            listCars.push({
                id: doc.id,
                name: doc.data().name,
                year: doc.data().year,
                km: doc.data().km,
                city: doc.data().city,
                price: doc.data().price,
                image: doc.data().images,
                uid: doc.data().uid
            })
        })

        setCars(listCars)
    }




    useEffect(() => {
        
        loadCars()

    } , [])


    return(
        <Container>
         <section
         className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2"
         >
            <input 
            className="w-full border-2 rounded-lg h-9 px-3 outline-none"
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for your car"
            />

            <button
            onClick={handleSearchCar}
            className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
            >
             Search
            </button>
        </section>

             <h1 
             className="font-bold text-center mt-6 text-2xl mb-4"
             >new and used cars throughout Malta</h1>

            <main
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
               {
                cars.map((car) => (
                   <Link
                   key={car.id}
                   to={`/details/${car.id}`}
                   >
                   
                   <section 
                    
                    className="w-ful bg-white rounded-lg overflow-hidden"
                    >

                        <div className="w-full h-72 rounded-lg bg-slate-200"
                        style={{display: loadImages.includes(car.id) ? 'none' : 'block'}}
                        >

                        </div>
                       <img
                       className="w-full rounded-lg max-h-72 mb-2 hover:scale-105 transition-all"
                       src={car.image[0].url} alt={car.name} 
                       onLoad={() => handleImageLoad(car.id)}
                       style={{display: loadImages.includes(car.id) ? 'block' : 'none'}}
                       />
   
                       <p
                        className="font-bold mt-1 mb-2 px-2"
                        >{car.name}</p>
   
                       <div
                       className="flex flex-col px-2"
                       >
                           <span
                           className="text-zinc-700 mb-6"
                           >Ano: {car.year} | {car.km} KM</span>
   
                           <strong
                           className="text-black font-medium text-xl"
                           >{Number(car.price).toLocaleString('pt-BR' , {
                            style:'currency',
                            currency: 'BRL'
                           })}
   
                           </strong>
                       </div>
   
                           <div
                           className="w-full h-px bg-slate-200 my-2"
                            ></div>
   
                            <div
                            className="px-2 pb-2"
                           >
                               <span
                               className="text-zinc-700"
                               >{car.city}</span>
                           </div>
                   </section>
                   </Link>
                ))
               }
                            
            </main>

            </Container>
    )
}