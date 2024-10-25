import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.svg';
import { Container } from '../../components/container';
import { Input } from '../../components/input';

import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';



const schema = z.object({
    email: z.string().min(1, 'E-mail obrigatorio').email('Insira um email valido'),
    password: z.string().min(6, 'password obrigatorio')
    
})

type FormData = z.infer<typeof schema>



export function SignIn(){

    const {register,handleSubmit, formState:{errors}} = useForm<FormData>({
        resolver:zodResolver(schema),
        mode:'onChange'
    })


    function onSubmit(data: FormData){
        console.log(data);
    }


    return(



        <Container>
            <div
            className='w-full min-h-screen flex justify-center  items-center flex-col gap-4'
            >
                <Link to='/'
                    className='mb-6 max-w-sm w-full'
                >
                    <img 
                    className='w-full'
                    src={logoImg} alt="Logo do site" />
                </Link>

                <form
                onSubmit={handleSubmit(onSubmit)}
                className='bg-white max-w-xl w-full rounded-lg'
                >
                    <Input
                        type='email'
                        placeholder='Digite seu email...'
                        name='email'
                        error={errors.email?.message}
                        register={register}
                    />
                    <Input
                        type='password'
                        placeholder='Digite seu password'
                        name='password'
                        error={errors.password?.message}
                        register={register}
                    />


                    <button>Acessar</button>
                </form>

            </div>
        </Container>
    )
}