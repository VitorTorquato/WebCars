import { Container } from "../../../components/container";
import { PainelHeader } from "../../../components/painelHeader";
import { Input } from "../../../components/input";


import {FiUpload} from 'react-icons/fi'


import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';


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


export function DashoardNew(){

    const {register, handleSubmit, formState:{errors} , reset} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    })


    function onSubmit(data: FormData){
        console.log(data)
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
                        type="file" accept="image" />
                    </div>
                </button>
            </div>


            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">

                <form 
                onSubmit={handleSubmit(onSubmit)}
                className="w-full"
                >

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Nome do carro</p>
                    <Input
                    type="text"
                    register={register}
                    name="carName"
                    error={errors.carName?.message}
                    placeholder="Ex: Onix 1.0..."
                    />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Modelo</p>
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
                            <p className="mb-2 font-medium">Ano do carro</p>
                        <Input
                        type="text"
                        register={register}
                        name="year"
                        error={errors.year?.message}
                        placeholder="Ex: 1.0 flex plus, manual..."
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
                                <p className="mb-2 font-medium">Telefone/Whatsapp</p>
                            <Input
                            type="text"
                            register={register}
                            name="whatsapp"
                            error={errors.whatsapp?.message}
                            placeholder="Ex: 11995985678..."
                            />
                            </div>

                            <div className="w-full">
                                <p className="mb-2 font-medium">Cidade</p>
                            <Input
                            type="text"
                            register={register}
                            name="city"
                            error={errors.city?.message}
                            placeholder="Ex: Salto,SP"
                            />
                            </div>

                         </div>

                         <div className="mb-3">
                             <p className="mb-2 font-medium">Preco</p>
                            <Input
                            type="text"
                            register={register}
                            name="price"
                            error={errors.price?.message}
                            placeholder="Ex: 145.000"
                            />
                         </div>

                         <div className="mb-3">
                             <p className="mb-2 font-medium">Descricao</p>

                             <textarea
                             className="border-2 w-full rounded-md h-24 px-2"
                             {...register('description')}
                             name="description"
                             id="description"
                             placeholder="Digite a descricao completa do seu carro.."
                             />
                             {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}

                         </div>

                        <button
                        
                        type="submit"
                        className="w-full h-10 rounded-md bg-zinc-900 font-medium text-white "
                        >
                            Cadastrar    
                        </button>                 

                </form>

            </div>
        </Container>
    )
}