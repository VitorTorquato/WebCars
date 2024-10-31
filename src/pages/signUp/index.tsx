import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.svg';
import { Container } from '../../components/container';
import { Input } from '../../components/input';

import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';



import { auth } from '../../services/firebaseConnection';
import { 
    createUserWithEmailAndPassword,
    signOut,
    updateProfile}
     from 'firebase/auth';
     
import { useEffect , useContext} from 'react';
import { AuthContext } from '../../contexts/authContext';



const schema = z.object({
    fullName: z.string().min(1, 'O campo nome e obrigatorio'),
    email: z.string().min(1, 'E-mail obrigatorio').email('Insira um email valido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
    
})

type FormData = z.infer<typeof schema>

import toast from 'react-hot-toast';

export function SignUp(){

    const {handleInfoUser } = useContext(AuthContext);

    const {register,handleSubmit, formState:{errors}} = useForm<FormData>({
        resolver:zodResolver(schema),
        mode:'onChange'
    })

    const navigate = useNavigate();

    async  function onSubmit(data: FormData){
        createUserWithEmailAndPassword(auth, data.email,data.password)
            .then( async (user) => {
                await updateProfile(user.user , {
                    displayName: data.fullName
                })

                handleInfoUser({
                    name:data.fullName,
                    email:data.email,
                    uid: user.user.uid
                })

                toast.success('Account created succssesfully')
                navigate('/dashboard' , {replace:true})
        }).catch(() => {
            toast.error('Something went wrong, try again!')
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
                            type='text'
                            placeholder='Name'
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
                            placeholder='Email address'
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
                    >Create your account</button>
                </form>

                <Link to='/signin'> 
                    Already have an account? Login!
                </Link>

            </div>
        </Container>
    )
}