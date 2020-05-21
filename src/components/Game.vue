<template>
<content>
    <Navbar/>
    <Authorized/>
</content>
    
</template>

<script>
import Navbar from '@/components/Navbar';
import Authorized from '@/components/Authorized';

export default {

    components : {
        Navbar,
        Authorized
    }
}
</script>