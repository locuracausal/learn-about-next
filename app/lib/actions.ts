'use server';

import z from 'zod'
import { Invoice } from './definitions';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect} from 'next/navigation'

const CreateInvoiceSchema = z.object({
    id:z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    date: z.string(),
    status: z.enum(['pending' , 'paid'])
}) 

const CreateInoviceFormSchema= CreateInvoiceSchema.omit(
    {id:true,
    date:true}
)


const UpdateInvoice = CreateInvoiceSchema.omit({ id: true, date: true });


export default async function createInvoice(formData:FormData) {
    
    const {customerId, amount, status} = CreateInoviceFormSchema.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    })
    const amountInCents = amount * 100
    const [date] = new Date().toISOString().split('T')
    console.log( 'Date:', date)
    console.log( 'Amount:', amount)
    console.log('customerId:', customerId)
    console.log('status: ', status)
    sql` INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId},${amountInCents}, ${status}, ${date} )
    `

    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
}


export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;
   
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }