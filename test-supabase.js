import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://pviwktddsltnjjnokrwc.supabase.co';
const supabaseKey = 'sb_publishable_PbxicU-umhZOO4PRhSGnHQ_qztBo_UW';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const lead = {
    name: "John Doe",
    phone: "123456",
    email: "john@example.com",
    location: "Pretoria"
  };
  const { data: insertData, error: insertError } = await supabase.from('leads').insert([lead]);
  console.log('Insert:', insertData, insertError);
}
test();
