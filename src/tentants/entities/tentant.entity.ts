import { Account } from 'src/accounts/entities/account.entity';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Tentant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: true })
    active: boolean;

    @Column({ nullable: true })
    image: string;

    @OneToOne(() => Apartment, apartment => apartment.tentant)
    @JoinColumn()
    apartment: Apartment

    @OneToOne(() => Account, account => account.tentant)
    @JoinColumn()
    account: Account
}
