import { Image } from '@chakra-ui/react';

import { Layout } from '@components/OldLayout';

import rainbow from '../images/rainbow.png';

function Home() {
    return (
        <div>
            <Image src={rainbow.src} alt="nothing" width="50px" height="50px" />
        </div>
    );
}

export default Home;
