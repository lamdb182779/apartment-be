import { Account } from 'src/accounts/entities/account.entity';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Owner {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: true })
    active: boolean;

    @Column({ nullable: true })
    image: string;

    @OneToMany(() => Apartment, apartment => apartment.owner)
    apartments: Apartment[]

    @OneToOne(() => Account, account => account.owner)
    @JoinColumn()
    account: Account
}
