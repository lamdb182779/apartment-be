import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    orderId: string;

    @Column()
    amount: number;

    @Column({ default: 'pending' })
    status: 'pending' | 'success' | 'failed';

    @Column({ nullable: true })
    bankCode: string;

    @Column({ nullable: true })
    transactionNo: string;

    @ManyToOne(() => Apartment, apartment => apartment.payments, { nullable: true })
    apartment: Apartment

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}