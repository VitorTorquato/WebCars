import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.svg';
import { Container } from '../../components/container';
import { Input } from '../../components/input';

import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

import { auth } from '../../services/firebaseConnection';
import {
    signInWithEmailAndPassword,
    signOut
 } from 'firebase/auth';
import { useEffect } from 'react';




const schema = z.object({
    email: z.string().min(1, 'E-mail obrigatorio').email('Insira um email valido'),
    password: z.string().min(6, 'password obrigatorio')
    
})

type FormData = z.infer<typeof schema>

import toast from 'react-hot-toast';

export function SignIn(){


    const navigate = useNavigate();

    const {register,handleSubmit, formState:{errors}} = useForm<FormData>({
        resolver:zodResolver(schema),
        mode:'onChange'
    })


    function onSubmit(data: FormData){
            signInWithEmailAndPassword(auth, data.email,data.password)
            .then((user) => {
                console.log(user)
                toast.success('Login successfully')                
                navigate('/dashboard' , {replace: true})
            }).catch(() => {
                toast.error("E-mail or password wrong doens't match")
            })

    }


    useEffect(() => {
        async function handleLogOut(){
            await signOut(auth);
        }

        handleLogOut();
    }
        , [])

        
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
                            type='email'
                            placeholder='Email...'
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
                            placeholder='Password'
                            name='password'
                            error={errors.password?.message}
                            register={register}
                        />
                    </div>


                    <button
                    type='submit'
                    className='bg-zinc-900 w-full rounded-md text-white h-10 font-medium'
                    >Acessar</button>
                </form>

                <Link to='/register'> 
                    Don't have an account? Signup!
                </Link>

            </div>
        </Container>
    )
}