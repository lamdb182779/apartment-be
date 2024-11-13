
import { Accountant } from 'src/accountants/entities/accountant.entity';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Bill {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: "Không có tiêu đề" })
    title: string;

    @Column("simple-json")
    content: any[];

    @Column("decimal")
    amount: number;

    @Column()
    expired: Date;

    @Column({ default: false })
    isPaid: boolean;

    @ManyToOne(() => Accountant, accountant => accountant.bills)
    accountant: Accountant

    @ManyToOne(() => Apartment, apartment => apartment.bills)
    apartment: Apartment
}
