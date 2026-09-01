import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function test() {
  console.log('🚀 Testing from PRETORIA with reference!');
  
  const { data, error } = await supabase
    .from('payment_events')
    .insert([{ 
      reference: 'ref_pretoria_' + Date.now(),
      email: 'willisderol@gmail.com',
      amount: 1200,
      status: 'success'
    }])
    .select();

  if(error) {
    console.log('❌ FAILED:', error);
  } else {
    console.log('✅ SUCCESS! SAVED:', data);
  }
}

test();
