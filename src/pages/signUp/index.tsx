import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.svg';
import { Container } from '../../components/container';
import { Input } from '../../components/input';

import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';



const schema = z.object({
    fullName: z.string().min(1, 'O campo nome e obrigatorio'),
    email: z.string().min(1, 'E-mail obrigatorio').email('Insira um email valido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
    
})

type FormData = z.infer<typeof schema>



export function SignUp(){

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
                className='bg-white max-w-xl w-full rounded-lg p-4'
                >
                    <div 
                    className='mb-3'
                    >
                        <Input
                            type='text'
                            placeholder='Digite seu nome'
                            name='fullName'
                            error={errors.fullName?.message}
                            register={register}
                        />
                    </div>
                    <div 
                    className='mb-3'
                    >
                        <Input
                            type='email'
                            placeholder='Digite seu email...'
                            name='email'
                            error={errors.email?.message}
                            register={register}
                        />
                    </div>

                    <div 
                    className='mb-3'
                    >
                        <Input
                            type='password'
                            placeholder='Digite seu password'
                            name='password'
                            error={errors.password?.message}
                            register={register}
                        />
                    </div>


                    <button
                    type='submit'
                    className='bg-zinc-900 w-full rounded-md text-white h-10 font-medium'
                    >Criar conta</button>
                </form>

                <Link to='/signin'> 
                    Ja posui uma conta? Faca o login!
                </Link>

            </div>
        </Container>
    )
}