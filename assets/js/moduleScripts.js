import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchCategories() {
    const { data, error } = await supabase
        .from('Categories')
        .select('*');
    if (error) console.error(error);
    else console.log(data);
}

fetchCategories();