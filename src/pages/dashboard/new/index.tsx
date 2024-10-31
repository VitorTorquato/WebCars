//Biblioteca uuid instalada que gera um id aleatorio, isso me permite a nunca enviar imagem com o mesmo nome para o meu campo de dados. 
import {v4 as uuidV4 } from 'uuid'
import { ChangeEvent ,useState, useContext} from "react";
import { Container } from "../../../components/container";
import { PainelHeader } from "../../../components/painelHeader";
import { Input } from "../../../components/input";


import {FiUpload,FiTrash} from 'react-icons/fi'


import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

import { AuthContext } from '../../../contexts/authContext'


import { storage , db} from '../../../services/firebaseConnection';

import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage'

import {addDoc,collection} from 'firebase/firestore'



const schema = z.object({
        carName: z.string().min(1,'o nome do carro e obrigatorio'),
        model: z.string().min(1,'o modelo e o obrigatorio'),
        year: z.string().min(1, 'o ano do carro e obrigatorio'),
        km: z.string().min(1, 'Infore a kilometragem'),
        price: z.string().min(1, 'Informe o preco do carro'),
        city: z.string().min(1, 'Informe a cidade'),
        whatsapp: z.string().min(1, 'Infore o numero do seu whatsapp').refine((value) => /^(\d{11,12})$/.test(value) ,{
            message:'Numero de telefone invalido'
        }),
        description: z.string().min(20,'Descricao obrigatoria')
})


type FormData = z.infer<typeof schema>;

interface ImageProps{
    uid:string;
    name:string;
    previewUrl: string;
    url: string
}

import toast from 'react-hot-toast';

export function DashoardNew(){

    const { user } = useContext(AuthContext);

    const [carImages,setCarImages] = useState<ImageProps[]>([])


    const {register, handleSubmit, formState:{errors} , reset} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    })


    function onSubmit(data: FormData){
        
            if(carImages.length === 0){
                toast.error('Send at least one image');
                
                return;
        }

        const carListImages = carImages.map( car => {
            return{
                uid:car.uid,
                name:car.name,
                url:car.url
            }
        })

        addDoc(collection(db, 'cars') , {
            name:data.carName.toUpperCase(),
            model:data.model,
            year: data.year,
            city: data.city,
            km: data.km,
            price: data.price,
            description: data.description,
            whatsapp: data.whatsapp,
            createdAt: new Date(),
            owner: user?.name,
            uid: user?.uid,
            images: carListImages,

        })
        .then(() => {
            reset();
            setCarImages([]);
            toast.success('Car uploaded successfully')
        }).catch((error) => {
            console.log(error , 'something went wrong')
        })

    }

    async function handleUpload(image : File){
        if(!user?.uid){
            return;
        }

        const currentUid = user?.uid;
        const uidImage = uuidV4();

        const uploadRef = ref(storage , `images/${currentUid}/${uidImage}`)

        uploadBytes(uploadRef , image)
        .then((snapshot) => {
            getDownloadURL(snapshot.ref).then((dowloadUrl) => {
                const imageItem = {
                    name: uidImage,
                    uid:currentUid,
                    previewUrl: URL.createObjectURL(image),
                    url: dowloadUrl,
                }

                setCarImages((prevState) => [...prevState, imageItem])
            })
        })
    }

    async  function handleFile(e:ChangeEvent<HTMLInputElement>){
            if(e.target.files && e.target.files[0]){
                const imgFile = e.target.files[0]


                if(imgFile.type === 'image/jpeg' || imgFile.type === 'image/png'){

                   await handleUpload(imgFile);
                }else{
                    alert('Envie uma imagem jpeg ou png')
                    return
                }
            }

    }


    async function handleDeleteImg(item:ImageProps){
          const imagePath = `images/${item.uid}/${item.name}`  

          const imageRef = ref(storage,imagePath);

          try{
            await deleteObject(imageRef)

            setCarImages(carImages.filter((car) => car.url !== item.url))
          }catch(error){
                console.log(error)
          }
    }

    return(
        <Container>
            <PainelHeader/>

            <div
            className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2"
            >

                <button 
                className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48"
                >
                    <div 
                    className="absolute cursor-pointer "
                    >
                        <FiUpload size={30} color="#000"/>
                    </div>
                    <div 
                    className="cursor-pointer"
                    >
                        <input
                        className="opacity-0 cursor-pointer"
                        type="file" 
                        accept="image"
                        onChange={handleFile} 
                        />
                    </div>
                </button>

                {
                    carImages.map((item) => (
                        <div
                        key={item.uid}

                        className='w-full h-32 flex items-center justify-center relative'
                        >
                            <button
                            onClick={() => handleDeleteImg(item)}
                            className='absolute'
                            >
                                <FiTrash size={28} color='#FFF'/>
                            </button>
                            <img 
                            className='rounded-lg w-full h-32 object-cover'
                            src={item.previewUrl} alt={item.name} />
                        </div>
                    ))
                }

            </div>


            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">

                <form 
                onSubmit={handleSubmit(onSubmit)}
                className="w-full"
                >

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Car name</p>
                    <Input
                    type="text"
                    register={register}
                    name="carName"
                    error={errors.carName?.message}
                    placeholder="Ex: Onix 1.0..."
                    />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Model</p>
                    <Input
                    type="text"
                    register={register}
                    name="model"
                    error={errors.model?.message}
                    placeholder="Ex: 1.0 flex plus, manual..."
                    />
                    </div>

                    <div className="flex w-full mb-3 flex-row items-center gap-4">

                        <div className="w-full">
                            <p className="mb-2 font-medium">Year</p>
                        <Input
                        type="text"
                        register={register}
                        name="year"
                        error={errors.year?.message}
                        placeholder="Ex: 2024/2025"
                        />
                        </div>
                        
                        <div className="w-full">
                            <p className="mb-2 font-medium">km</p>
                        <Input
                        type="text"
                        register={register}
                        name="km"
                        error={errors.km?.message}
                        placeholder="Ex: 19.345..."
                        />
                        </div>
                        
                    </div>

                    <div className="flex w-full mb-3 flex-row items-center gap-4">

                            <div className="w-full">
                                <p className="mb-2 font-medium">Phone/Whatsapp</p>
                            <Input
                            type="text"
                            register={register}
                            name="whatsapp"
                            error={errors.whatsapp?.message}
                            placeholder="Ex: 35698570958..."
                            />
                            </div>

                            <div className="w-full">
                                <p className="mb-2 font-medium">City</p>
                            <Input
                            type="text"
                            register={register}
                            name="city"
                            error={errors.city?.message}
                            placeholder="Ex: Sliema"
                            />
                            </div>

                         </div>

                         <div className="mb-3">
                             <p className="mb-2 font-medium">Price</p>
                            <Input
                            type="text"
                            register={register}
                            name="price"
                            error={errors.price?.message}
                            placeholder="Ex: 145.000"
                            />
                         </div>

                         <div className="mb-3">
                             <p className="mb-2 font-medium">Description</p>

                             <textarea
                             className="border-2 w-full rounded-md h-24 px-2"
                             {...register('description')}
                             name="description"
                             id="description"
                             placeholder="Describe all the details of your vehicle"
                             />
                             {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}

                         </div>

                        <button
                        
                        type="submit"
                        className="w-full h-10 rounded-md bg-zinc-900 font-medium text-white "
                        >
                            Upload    
                        </button>                 

                </form>

            </div>
        </Container>
    )
}