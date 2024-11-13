import { Accountant } from 'src/accountants/entities/accountant.entity';
import { Owner } from 'src/owners/entities/owner.entity';
import { Tentant } from 'src/tentants/entities/tentant.entity';
import { Entity, Column, PrimaryColumn, OneToOne } from 'typeorm';

@Entity()
export class Account {
    @PrimaryColumn()
    username: string;

    @Column()
    password: string;

    @Column()
    role: string;

    @Column({ default: true })
    active: boolean;

    @OneToOne(() => Tentant, tentant => tentant.account, { nullable: true })
    tentant: Tentant

    @OneToOne(() => Owner, owner => owner.account, { nullable: true })
    owner: Owner

    @OneToOne(() => Accountant, accountant => accountant.account, { nullable: true })
    accountant: Accountant
}