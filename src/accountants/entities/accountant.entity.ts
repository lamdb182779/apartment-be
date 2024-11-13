import { Account } from 'src/accounts/entities/account.entity';
import { Bill } from 'src/bills/entities/bill.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Accountant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: true })
    active: boolean;

    @Column({ nullable: true })
    image: string;

    @OneToMany(() => Bill, bill => bill.accountant)
    bills: Bill[]

    @OneToOne(() => Account, account => account.accountant)
    @JoinColumn()
    account: Account
}

